export function AnimatedBackground() {
  return (
    <div className="engineering-background" aria-hidden="true">
      <div className="engineering-grid" />
      <svg className="engineering-blueprint" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="blueprint-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#CAF0F8" stopOpacity="0.72" />
            <stop offset="1" stopColor="#00B4D8" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        <g className="blueprint-gear blueprint-gear-left" fill="none" stroke="url(#blueprint-fade)">
          <circle cx="190" cy="245" r="73" strokeWidth="2" />
          <circle cx="190" cy="245" r="44" strokeWidth="1.5" />
          <circle cx="190" cy="245" r="12" strokeWidth="2" />
          <path d="M190 158v25m0 124v25m-87-87h25m124 0h25m-149-62 18 18m88 88 18 18m0-124-18 18m-88 88-18 18" strokeWidth="11" />
        </g>

        <g className="blueprint-gear blueprint-gear-right" fill="none" stroke="url(#blueprint-fade)">
          <circle cx="1235" cy="615" r="105" strokeWidth="2" />
          <circle cx="1235" cy="615" r="63" strokeWidth="1.5" />
          <circle cx="1235" cy="615" r="16" strokeWidth="2" />
          <path d="M1235 496v32m0 174v32m-119-119h32m174 0h32m-203-84 23 23m122 122 23 23m0-168-23 23m-122 122-23 23" strokeWidth="14" />
        </g>

        <g className="blueprint-machine blueprint-drift" fill="none" stroke="url(#blueprint-fade)" strokeWidth="1.7">
          <rect x="940" y="135" width="255" height="138" rx="8" />
          <path d="M960 245h210M990 245v42m150-42v42M970 287h220M1012 165h108v52h-108zM1135 160l36 27v55l-36 23M980 175h17m-17 18h17m-17 18h17" />
          <path d="M944 116h252m-252-8v16m252-8v16M912 304h306" strokeDasharray="5 7" />
          <text x="946" y="102" fill="#90E0EF" stroke="none" fontSize="12" letterSpacing="3">CNC / AXIS-04</text>
        </g>

        <g className="blueprint-caliper blueprint-drift-reverse" fill="none" stroke="url(#blueprint-fade)" strokeWidth="2">
          <path d="M230 666h320M270 624v85m0-85h74v42h-74m242-42v85m-74-85h74v42h-74M320 666v-55h140v55" />
          <path d="M230 732h320m-320-8v16m320-8v16" strokeDasharray="4 6" />
          <text x="326" y="758" fill="#90E0EF" stroke="none" fontSize="12" letterSpacing="2">160.00 mm</text>
        </g>

        <g className="blueprint-bearing blueprint-float" fill="none" stroke="url(#blueprint-fade)">
          <circle cx="680" cy="740" r="70" strokeWidth="2" />
          <circle cx="680" cy="740" r="42" strokeWidth="2" />
          <circle cx="680" cy="740" r="14" strokeWidth="2" />
          <circle cx="680" cy="680" r="8" /><circle cx="732" cy="710" r="8" /><circle cx="732" cy="770" r="8" /><circle cx="680" cy="800" r="8" /><circle cx="628" cy="770" r="8" /><circle cx="628" cy="710" r="8" />
        </g>

        <g className="blueprint-circuit" fill="none" stroke="url(#blueprint-fade)" strokeWidth="1.4">
          <path d="M520 118h120l24 24h104m-248 18h82l24 24h142m-238 18h52l26 26h140" strokeDasharray="2 5" />
          <circle cx="520" cy="118" r="4" fill="#90E0EF" /><circle cx="768" cy="142" r="4" fill="#90E0EF" /><circle cx="768" cy="184" r="4" fill="#90E0EF" /><circle cx="728" cy="228" r="4" fill="#90E0EF" />
        </g>

        <g className="blueprint-particles" fill="#90E0EF">
          <circle cx="430" cy="310" r="2" /><circle cx="860" cy="345" r="2.5" /><circle cx="1010" cy="440" r="1.5" /><circle cx="345" cy="510" r="2" /><circle cx="790" cy="590" r="1.5" /><circle cx="1120" cy="790" r="2" />
        </g>
      </svg>
    </div>
  )
}
