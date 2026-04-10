import React from 'react';

const PremiumBannerSection = () => {
  return (
    <section className="px-4 mt-5 sm:px-5 lg:px-6">
      <div className="group relative overflow-hidden rounded-[28px] border border-[#b88a2a]/70 bg-[linear-gradient(135deg,#0f0b06_0%,#1a1208_28%,#3b280d_62%,#7b5716_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(91,64,12,0.35)]">
        
        {/* Outer gold glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-[#f4d27a]/20" />

        {/* Inner luxury border */}
        <div className="pointer-events-none absolute inset-[1.2px] rounded-[27px] border border-[#f3cd72]/25" />

        {/* Soft gold ambient lights */}
        <div className="pointer-events-none absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[#f5c96b]/10 blur-3xl transition-all duration-500 group-hover:bg-[#f5c96b]/15" />
        <div className="pointer-events-none absolute right-8 top-6 h-24 w-24 rounded-full bg-[#ffd978]/10 blur-3xl transition-all duration-500 group-hover:scale-110" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-20 w-20 rounded-full bg-[#ffcf70]/10 blur-2xl" />

        {/* Shine sweep */}
        <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,224,150,0.16),transparent)] opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

        {/* Texture line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f7d980]/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d8a947]/30 to-transparent" />

        <div className="relative px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div className="max-w-[720px]">
            <h2 className="text-[24px] font-extrabold uppercase tracking-[0.22em] text-[#f6d57a] drop-shadow-[0_0_10px_rgba(255,214,122,0.15)] sm:text-[30px] lg:text-[34px]">
              Premium Reader
            </h2>

            <p className="mt-2 text-sm font-medium text-[#f4e6bf]/80 sm:text-[15px]">
              Unlock more stories and premium perks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBannerSection;
