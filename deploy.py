import os
import sys
import subprocess
import paramiko
import time

# ==============================================================================
# DEPLOYMENT CONFIGURATION
# ==============================================================================
HOST = "145.79.213.57"
PORT = 65002
USER = "u581617111"
PASS = "Yourcart@2024" # DO NOT COMMIT THIS FILE PUBLICLY

REMOTE_BASE = "domains/rhc.imakshay.in/public_html"

FRONTEND_SKIP = []
BACKEND_SKIP = [
    ".git", ".env", "node_modules", "storage", "vendor",
    "tests", ".phpunit.cache", "phpunit.xml", "deploy.py",
    "storage/logs", "storage/framework/cache", "storage/framework/sessions"
]

BACKEND_PRESERVE = ['.env', 'vendor', 'storage']

# ==============================================================================

def print_hdr(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def ssh_exec(ssh, cmd, show=True):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8').strip()
    err = stderr.read().decode('utf-8').strip()
    if show and out: print(out)
    if show and err: print(err)
    if exit_status != 0 and show:
        print(f"Command failed (Code {exit_status}): {cmd}")
    return exit_status, out

def sftp_upload_dir(sftp, local_dir, remote_dir, skip_list):
    try:
        sftp.mkdir(remote_dir)
    except IOError:
        pass
        
    uploaded = 0
    for item in os.listdir(local_dir):
        if item in skip_list:
            continue
            
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"
        
        if os.path.isfile(local_path):
            sftp.put(local_path, remote_path)
            uploaded += 1
        elif os.path.isdir(local_path):
            uploaded += sftp_upload_dir(sftp, local_path, remote_path, skip_list)
            
    return uploaded

def clean_remote_dir(ssh, remote_dir, preserve_list):
    _, out = ssh_exec(ssh, f"ls -1 {remote_dir}", show=False)
    items = [line for line in out.split('\n') if line]
    
    for item in items:
        if item in preserve_list or item.startswith('.'):
            continue
        ssh_exec(ssh, f"rm -rf {remote_dir}/{item}", show=False)
        print(f"  Cleaned {remote_dir}/{item}")

# ==============================================================================
# SCRIPT
# ==============================================================================
if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # ── Step 1: Build Frontend ──
    print_hdr("BUILDING FRONTEND")
    os.chdir(current_dir)
    if subprocess.call("npm run build", shell=True) != 0:
        print("Build failed. Aborting.")
        sys.exit(1)
        
    # ── Step 2: Connect SSH ──
    print_hdr("CONNECTING TO SERVER")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=10)
        sftp = ssh.open_sftp()
        print("  Connected Successfully!")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

    # ── Step 3: Clean Old Frontend Assets ──
    print("\n[Cleaning old frontend assets...]")
    ssh_exec(ssh, f"rm -rf {REMOTE_BASE}/assets", show=False)
    ssh_exec(ssh, f"rm -f {REMOTE_BASE}/index.html", show=False)
    print("  Cleaned old assets and index.html")

    # ── Step 4: Clean Old Backend Files ──
    print("\n[Cleaning old backend files (preserving storage, vendor, .env)...]")
    clean_remote_dir(ssh, f"{REMOTE_BASE}/backend", BACKEND_PRESERVE)

    # ── Step 5: Upload Files ──
    print("\n[Uploading backend files...]")
    b_count = sftp_upload_dir(sftp, os.path.join(current_dir, "backend"), f"{REMOTE_BASE}/backend", BACKEND_SKIP)
    print(f"  Uploaded {b_count} backend files")
    
    # Restore permissions for framework standard folders
    ssh_exec(ssh, f"mkdir -p {REMOTE_BASE}/backend/storage/framework/cache/data", show=False)
    ssh_exec(ssh, f"mkdir -p {REMOTE_BASE}/backend/storage/framework/sessions", show=False)
    ssh_exec(ssh, f"mkdir -p {REMOTE_BASE}/backend/storage/framework/views", show=False)
    ssh_exec(ssh, f"mkdir -p {REMOTE_BASE}/backend/storage/logs", show=False)
    ssh_exec(ssh, f"chmod -R 775 {REMOTE_BASE}/backend/storage", show=False)

    print("\n[Uploading frontend built dist...]")
    f_count = sftp_upload_dir(sftp, os.path.join(current_dir, "dist"), REMOTE_BASE, FRONTEND_SKIP)
    print(f"  Uploaded {f_count} frontend files")

    # ── Step 6: Post-Deploy Commands ──
    print("\n[Running artisan migrations and caches...]")
    backend_path = f"{REMOTE_BASE}/backend"
    cmds = [
        f"cd {backend_path} && php artisan config:clear",
        f"cd {backend_path} && php artisan route:clear",
        f"cd {backend_path} && php artisan view:clear",
        f"cd {backend_path} && php artisan cache:clear",
        f"cd {backend_path} && php artisan migrate --force",
        f"cd {backend_path} && php artisan config:cache",
        f"cd {backend_path} && php artisan route:cache"
    ]
    for cmd in cmds:
        print(f"  Executing: {cmd.split('&& ')[1]}")
        ssh_exec(ssh, cmd)

    sftp.close()
    ssh.close()
    
    print_hdr("DEPLOYMENT COMPLETE! ✔")
    print("Site: https://rhc.imakshay.in")
