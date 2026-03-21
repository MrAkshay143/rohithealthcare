export function Logo({ className = "", customLogo = "" }: { className?: string; customLogo?: string }) {
  if (customLogo) {
    return (
      <img src={customLogo} alt="Logo" className={`h-10 w-auto ${className}`} />
    )
  }

  return (
    <div className={`relative select-none inline-flex flex-col items-start ${className}`}>
      <div className="relative leading-none">
        <div className="flex items-end leading-none">
          <span
            className="text-[#015851] font-black tracking-wider"
            style={{ lineHeight: 1, fontFamily: '"Arial Black",Arial,sans-serif' }}
          >
            ROH
          </span>
          <span
            className="relative text-[#015851] font-black tracking-wider"
            style={{ lineHeight: 1, fontFamily: '"Arial Black",Arial,sans-serif' }}
          >
            <svg
              className="absolute fill-[#A62B2B]"
              style={{ width: "0.55em", height: "0.65em", top: "-0.62em", left: "50%", transform: "translateX(-50%)" }}
              viewBox="0 0 60 52"
            >
              <path d="M14,46 C7,32 7,11 22,3 C28,13 24,37 14,46Z" />
              <path d="M30,50 C19,34 21,8 38,1 C45,18 38,42 30,50Z" />
              <path d="M46,46 C53,32 53,11 38,3 C32,13 36,37 46,46Z" />
            </svg>
            I
          </span>
          <span
            className="text-[#015851] font-black tracking-wider"
            style={{ lineHeight: 1, fontFamily: '"Arial Black",Arial,sans-serif' }}
          >
            T
          </span>
        </div>
        <svg
          className="w-full fill-[#015851]"
          style={{ height: "0.22em", display: "block", marginTop: "0.04em" }}
          viewBox="0 0 220 10"
          preserveAspectRatio="none"
        >
          <path d="M0,3 C30,0 90,10 220,5 L220,2.5 C90,7.5 30,-2.5 0,0.5 Z" />
        </svg>
      </div>
      <span
        className="text-[#A62B2B] font-semibold tracking-wide ml-auto"
        style={{ fontSize: "0.52em", fontFamily: "Georgia,serif", marginTop: "0.12em" }}
      >
        Health Care
      </span>
    </div>
  );
}
