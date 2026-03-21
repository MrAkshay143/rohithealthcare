<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\EnquiryMessage;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EnquiryController extends Controller
{
    /**
     * Public: submit a new enquiry from contact form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:30',
            'email'   => 'nullable|email|max:255',
            'message' => 'required|string|max:5000',
            'browser' => 'nullable|string|max:500',
            'device'  => 'nullable|string|max:255',
        ]);

        $validated['ip']        = $request->ip();
        $validated['status']    = 'new';
        $validated['createdAt'] = now();

        // Resolve city / region / country from IP
        $geo = $this->resolveLocation($validated['ip']);
        $validated['city']    = $geo['city']    ?? null;
        $validated['region']  = $geo['region']  ?? null;
        $validated['country'] = $geo['country'] ?? null;

        $enquiry = Enquiry::create($validated);

        // Also create the first message (the customer's original message)
        EnquiryMessage::create([
            'enquiry_id'   => $enquiry->id,
            'sender'       => 'customer',
            'message'      => $validated['message'],
            'sentViaEmail' => false,
            'createdAt'    => now(),
        ]);

        return response()->json(['success' => true, 'id' => $enquiry->id], 201);
    }

    /**
     * Admin: list all enquiries.
     */
    public function index(Request $request)
    {
        $query = Enquiry::withCount('messages')
            ->orderByRaw("FIELD(status, 'new', 'read', 'replied')")
            ->orderBy('createdAt', 'desc');

        $status = $request->query('status');
        if ($status && in_array($status, ['new', 'read', 'replied'])) {
            $query->where('status', $status);
        }

        return response()->json($query->get());
    }

    /**
     * Admin: get single enquiry with full conversation.
     */
    public function show(int $id)
    {
        $enquiry = Enquiry::with('messages')->findOrFail($id);

        // Mark as read if new
        if ($enquiry->status === 'new') {
            $enquiry->update(['status' => 'read', 'readAt' => now()]);
        }

        return response()->json($enquiry);
    }

    /**
     * Admin: add a message to the conversation.
     */
    public function addMessage(Request $request, int $id)
    {
        $enquiry = Enquiry::findOrFail($id);

        $validated = $request->validate([
            'message'   => 'required|string|max:5000',
            'sendEmail' => 'nullable|boolean',
        ]);

        $sentViaEmail = false;

        // Send via SMTP if requested and customer has email
        if (!empty($validated['sendEmail']) && !empty($enquiry->email)) {
            $sentViaEmail = $this->sendEmailReply($enquiry, $validated['message']);
        }

        $msg = EnquiryMessage::create([
            'enquiry_id'   => $enquiry->id,
            'sender'       => 'admin',
            'message'      => $validated['message'],
            'sentViaEmail' => $sentViaEmail,
            'createdAt'    => now(),
        ]);

        // Update enquiry status
        $enquiry->update([
            'status'     => 'replied',
            'adminReply' => $validated['message'],
            'repliedAt'  => now(),
        ]);

        return response()->json($msg, 201);
    }

    /**
     * Admin: get conversation messages for an enquiry.
     */
    public function messages(int $id)
    {
        $enquiry = Enquiry::findOrFail($id);
        return response()->json($enquiry->messages()->orderBy('createdAt', 'asc')->get());
    }

    /**
     * Admin: delete an enquiry + all messages.
     */
    public function destroy(int $id)
    {
        $enquiry = Enquiry::findOrFail($id);
        $enquiry->messages()->delete();
        $enquiry->delete();
        return response()->json(['success' => 'Enquiry deleted']);
    }

    /**
     * Admin: enquiry stats for dashboard.
     */
    public function stats()
    {
        $total   = Enquiry::count();
        $new     = Enquiry::where('status', 'new')->count();
        $read    = Enquiry::where('status', 'read')->count();
        $replied = Enquiry::where('status', 'replied')->count();

        $daily = Enquiry::selectRaw("DATE(createdAt) as date, COUNT(*) as count")
            ->where('createdAt', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topCities = Enquiry::selectRaw("COALESCE(city, 'Unknown') as city, COUNT(*) as count")
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $responseRate = $total > 0 ? round(($replied / $total) * 100) : 0;

        $avgResponse = Enquiry::whereNotNull('repliedAt')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, createdAt, repliedAt)) as avg_hours')
            ->value('avg_hours');

        return response()->json(compact(
            'total',
            'new',
            'read',
            'replied',
            'daily',
            'topCities',
            'responseRate',
            'avgResponse'
        ));
    }

    /**
     * Admin: test SMTP configuration.
     */
    public function testSmtp(Request $request)
    {
        $validated = $request->validate([
            'to' => 'required|email|max:255',
        ]);

        if (!$this->configureSmtp()) {
            return response()->json(['error' => 'SMTP is not configured. Go to Settings → Email to set it up.'], 422);
        }

        try {
            Mail::raw('This is a test email from Rohit Health Care admin panel.', function ($m) use ($validated) {
                $m->to($validated['to'])->subject('SMTP Test - Rohit Health Care');
            });
            return response()->json(['success' => 'Test email sent to ' . $validated['to']]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send: ' . $e->getMessage()], 500);
        }
    }

    /* ═══════════════════════════════════════════════
     *  PRIVATE HELPERS
     * ═══════════════════════════════════════════════ */

    private function resolveLocation(string $ip): array
    {
        $result = ['city' => null, 'region' => null, 'country' => null];

        if (in_array($ip, ['127.0.0.1', '::1']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
            return $result;
        }

        try {
            $ctx  = stream_context_create(['http' => ['timeout' => 3]]);
            $json = @file_get_contents("http://ip-api.com/json/" . urlencode($ip) . "?fields=status,city,regionName,country", false, $ctx);
            if ($json) {
                $data = json_decode($json, true);
                if (($data['status'] ?? '') === 'success') {
                    $result['city']    = $data['city']       ?? null;
                    $result['region']  = $data['regionName'] ?? null;
                    $result['country'] = $data['country']    ?? null;
                }
            }
        } catch (\Exception $e) {
            Log::warning('IP geolocation failed', ['ip' => $ip, 'error' => $e->getMessage()]);
        }

        return $result;
    }

    private function configureSmtp(): bool
    {
        $keys     = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'];
        $settings = SiteSetting::whereIn('key', $keys)->pluck('value', 'key');

        if (empty($settings['smtp_host'])) {
            return false;
        }

        config([
            'mail.default'                 => 'smtp',
            'mail.mailers.smtp.host'       => $settings['smtp_host'],
            'mail.mailers.smtp.port'       => (int) ($settings['smtp_port'] ?? 587),
            'mail.mailers.smtp.username'   => $settings['smtp_user'] ?? '',
            'mail.mailers.smtp.password'   => $settings['smtp_pass'] ?? '',
            'mail.mailers.smtp.encryption' => ((int) ($settings['smtp_port'] ?? 587)) === 465 ? 'ssl' : 'tls',
            'mail.from.address'            => $settings['smtp_from'] ?? $settings['smtp_user'] ?? '',
            'mail.from.name'               => 'Rohit Health Care',
        ]);

        return true;
    }

    private function sendEmailReply(Enquiry $enquiry, string $replyMessage): bool
    {
        if (!$this->configureSmtp()) {
            return false;
        }

        try {
            $name  = $enquiry->name;
            $email = $enquiry->email;

            $body = "Dear {$name},\n\n"
                . $replyMessage . "\n\n"
                . "- Rohit Health Care\n"
                . "This is a reply to your enquiry submitted on our website.";

            Mail::raw($body, function ($m) use ($email, $name) {
                $m->to($email, $name)
                    ->subject('Reply to your enquiry - Rohit Health Care');
            });

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send enquiry reply email', [
                'enquiry_id' => $enquiry->id,
                'error'      => $e->getMessage(),
            ]);
            return false;
        }
    }
}

