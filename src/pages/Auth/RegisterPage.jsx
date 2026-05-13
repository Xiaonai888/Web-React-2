Replace ONLY the Date of Birth block with this:

<label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
  Date of Birth
</label>

<div className="mb-4 grid grid-cols-3 gap-2">
  <div className="relative">
    <select
      value={birthDay}
      onChange={(event) => setBirthDay(event.target.value)}
      className={`h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ${
        birthDay ? 'text-[#111827]' : 'text-transparent'
      }`}
    >
      <option value="" disabled>
        Day
      </option>
      {days.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>

    <span
      className={`pointer-events-none absolute left-3 text-[#8d94a1] transition-all ${
        birthDay ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]'
      }`}
    >
      Day
    </span>

    <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
  </div>

  <div className="relative">
    <select
      value={birthMonth}
      onChange={(event) => setBirthMonth(event.target.value)}
      className={`h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ${
        birthMonth ? 'text-[#111827]' : 'text-transparent'
      }`}
    >
      <option value="" disabled>
        Month
      </option>
      {months.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>

    <span
      className={`pointer-events-none absolute left-3 text-[#8d94a1] transition-all ${
        birthMonth ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]'
      }`}
    >
      Month
    </span>

    <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
  </div>

  <div className="relative">
    <select
      value={birthYear}
      onChange={(event) => setBirthYear(event.target.value)}
      className={`h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ${
        birthYear ? 'text-[#111827]' : 'text-transparent'
      }`}
    >
      <option value="" disabled>
        Year
      </option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>

    <span
      className={`pointer-events-none absolute left-3 text-[#8d94a1] transition-all ${
        birthYear ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]'
      }`}
    >
      Year
    </span>

    <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
  </div>
</div>
