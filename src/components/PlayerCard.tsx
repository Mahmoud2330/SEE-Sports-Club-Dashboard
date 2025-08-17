import React from "react";
import athleteImage from "../assets/Player_Pic.png"; 
// import { FaLink, FaDribbble, FaBold } from "react-icons/fa";
// import styles from "../PlayerCard.module.css";
import '../index.css';
import type { Player } from '../services/dataService';

interface PlayerCardProps {
  playerData?: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ playerData }) => {
  // Use player data if available, otherwise fall back to defaults
  const playerName = playerData?.name || "AHMED";
  const playerLastName = playerData?.name?.split(' ').slice(1).join(' ') || "ALY";
  const playerFirstName = playerData?.name?.split(' ')[0] || "AHMED";
  const playerPosition = playerData?.position || "CENTER ATTACKING MIDFIELDER";
  const playerShortPosition = playerData?.shortPosition || "CAM";
  const playerTotalScore = playerData?.totalScore || "72";
  const playerPhysical = playerData?.physical || "72";
  const playerSkills = playerData?.skills || "91";
  const playerProfilePicture = playerData?.profilePicture || athleteImage;

  return (
  <>
    {/* 1) SVG clipPath definition */}
    {/* <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <clipPath id="cardWave" clipPathUnits="objectBoundingBox">
          <path d="
            M0.05,0.02
            C0.30,0    0.80,0    0.95,0.12
            C1,   0.50  1,   0.85  0.62,1
            C0.30,0.99 0.12,0.50 0.05,0.02
            Z
          " />
        </clipPath>
      </defs>
    </svg> */}

<div className="player-card-container">

<svg width="369" height="459" viewBox="0 0 369 459" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<g filter="url(#filter0_d_29_6)">

{/* Black Background of Card */}
<path d="M184.2 62.87C115.76 94.17 50.18 94.47 50.18 94.47V390.73C50.18 390.73 115.76 427.57 184.2 396.27C252.64 364.97 318.22 364.67 318.22 364.67V68.41C318.22 68.41 252.64 31.57 184.2 62.87Z" fill="black"/>

{/* Purple Background */}
<path d="M125.4 403.21C91.73 403.21 64.51 391.47 55.84 387.26V99.97C73.36 99.16 128.57 94.54 186.55 68.02C204.1 59.99 223.09 55.93 242.99 55.93C276.66 55.93 303.88 67.67 312.54 71.88V359.18C295.02 359.99 239.81 364.61 181.83 391.13C164.28 399.16 145.29 403.22 125.4 403.22V403.21Z" fill="url(#paint0_linear_29_6)"/>

{/* Purple Rectangles shade */}
<mask id="mask0_29_6"  maskUnits="userSpaceOnUse" x="55" y="55" width="258" height="349"> 
<path d="M125.4 403.21C91.73 403.21 64.51 391.47 55.84 387.26V99.97C73.36 99.16 128.57 94.54 186.55 68.02C204.1 59.99 223.09 55.93 242.99 55.93C276.66 55.93 303.88 67.67 312.54 71.88V359.18C295.02 359.99 239.81 364.61 181.83 391.13C164.28 399.16 145.29 403.22 125.4 403.22V403.21Z" fill="white"/>
 </mask>


 {/*Gradient Purple rectangles  */}
<g mask="url(#mask0_29_6)">
<path d="M40.4501 150.85H72.8801L73.0301 150.35C82.1001 122.36 91.2301 102.93 99.5901 89.44H64.2401C56.1901 105.35 48.7201 124.3 41.8701 146.23L40.4401 150.84L40.4501 150.85Z" fill="url(#paint1_linear_29_6)"/>
<path d="M97.63 150.85H130.06L130.21 150.35C139.28 122.36 148.41 102.93 156.77 89.44H121.42C113.37 105.35 105.9 124.3 99.05 146.23L97.62 150.84L97.63 150.85Z" fill="url(#paint2_linear_29_6)"/>
<path d="M32.08 240.84C24.74 244.21 20.11 242.72 19.23 242.37C19.54 242.51 19.7 242.62 19.7 242.62L4.76001 269.71C9.01001 272.05 15.46 273.9 23.13 273.9C28.98 273.9 35.53 272.83 42.35 270.09C61.96 262.21 79.6 242.83 95.07 212.25H59.72C48.4 230.51 38.5 237.89 32.07 240.84H32.08Z" fill="url(#paint3_linear_29_6)"/>
<path d="M154.22 150.85H121.79L121.64 151.34C112.57 179.33 103.43 198.76 95.08 212.25H130.43C138.48 196.34 145.95 177.39 152.8 155.46L154.23 150.85H154.22Z" fill="url(#paint4_linear_29_6)"/>
<path d="M175.56 59.37C175.56 59.37 175.49 59.34 175.45 59.32C175.5 59.34 175.54 59.36 175.56 59.37Z" fill="url(#paint5_linear_29_6)"/>
<path d="M118.38 59.37C118.38 59.37 118.31 59.34 118.27 59.32C118.31 59.34 118.36 59.36 118.38 59.37Z" fill="url(#paint6_linear_29_6)"/>
<path d="M232.73 59.37C232.73 59.37 232.66 59.34 232.62 59.32C232.66 59.34 232.71 59.35 232.73 59.37Z" fill="url(#paint7_linear_29_6)"/>
<path d="M118.27 59.32C111.74 67.72 105.51 77.76 99.6 89.44H134.95C146.27 71.18 156.17 63.8 162.6 60.85C169.94 57.48 174.57 58.97 175.45 59.32C175.14 59.18 174.98 59.07 174.98 59.07L189.92 31.98C182.43 27.85 168.09 25.27 152.33 31.6C140.21 36.47 128.85 45.73 118.28 59.31C118.32 59.33 118.35 59.34 118.39 59.36C118.36 59.35 118.32 59.33 118.28 59.31L118.27 59.32Z" fill="url(#paint8_linear_29_6)"/>
<path d="M175.44 59.32C168.91 67.72 162.68 77.76 156.77 89.44H192.12C203.44 71.18 213.34 63.8 219.77 60.85C227.11 57.48 231.74 58.97 232.62 59.32C232.31 59.18 232.14 59.07 232.14 59.07L247.08 31.98C239.59 27.85 225.25 25.27 209.49 31.6C197.37 36.47 186.01 45.73 175.44 59.31C175.48 59.33 175.51 59.34 175.55 59.36C175.52 59.35 175.48 59.33 175.44 59.31V59.32Z" fill="url(#paint9_linear_29_6)"/>
<path d="M232.62 59.32C226.09 67.71 219.86 77.76 213.95 89.44H249.29C260.61 71.18 270.51 63.8 276.94 60.85C284.66 57.3 289.39 59.14 289.9 59.36C289.51 59.19 289.32 59.06 289.32 59.06L304.26 31.97C296.77 27.84 282.43 25.26 266.67 31.59C254.55 36.46 243.19 45.72 232.62 59.31C232.66 59.33 232.69 59.34 232.73 59.36C232.71 59.35 232.66 59.33 232.62 59.31V59.32Z" fill="url(#paint10_linear_29_6)"/>
<path d="M97.04 150.85H64.61L64.46 151.34C55.38 179.33 46.25 198.77 37.9 212.26H73.25C81.3 196.35 88.77 177.4 95.62 155.47L97.05 150.86L97.04 150.85Z" fill="url(#paint11_linear_29_6)"/>
<path d="M156.24 146.23L154.81 150.84H187.24L187.39 150.35C196.46 122.36 205.59 102.93 213.95 89.44H178.61C170.56 105.35 163.09 124.3 156.24 146.23Z" fill="url(#paint12_linear_29_6)"/>
</g>


{/* Player Image!!!!  */}
<rect x="74.09" y="95.52" width="175.52" height="240.24" fill="url(#pattern0_29_6)"/>
<foreignObject x="74.09" y="95.52" width="175.52" height="240.24">
  <img 
    src={playerProfilePicture} 
    alt="Athlete" 
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</foreignObject>

{/* Bottom Black Shade */}
<path d="M125.4 403.21C91.73 403.21 64.51 391.47 55.84 387.26V99.97C73.36 99.16 128.57 94.54 186.55 68.02C204.1 59.99 223.09 55.93 242.99 55.93C276.66 55.93 303.88 67.67 312.54 71.88V359.18C295.02 359.99 239.81 364.61 181.83 391.13C164.28 399.16 145.29 403.22 125.4 403.22V403.21Z" fill="url(#paint13_linear_29_6)"/>

{/* PHY */}

<path d="M227.622 187.188H233.031C234.101 187.188 234.963 187.491 235.618 188.097C236.272 188.697 236.6 189.542 236.6 190.634C236.6 191.572 236.308 192.39 235.724 193.089C235.14 193.782 234.243 194.128 233.031 194.128H229.251V199.21H227.622V187.188ZM234.955 190.642C234.955 189.758 234.627 189.158 233.973 188.841C233.613 188.672 233.119 188.588 232.491 188.588H229.251V192.753H232.491C233.222 192.753 233.814 192.598 234.267 192.287C234.725 191.976 234.955 191.427 234.955 190.642ZM238.686 187.188H240.331V192.156H246.584V187.188H248.228V199.21H246.584V193.588H240.331V199.21H238.686V187.188ZM249.824 187.188H251.723L255.176 192.966L258.63 187.188H260.537L255.995 194.365V199.21H254.366V194.365L249.824 187.188Z" fill="#9C70FA"/>

{/* PHY Rating */}

<text
  x={262}
  y={187}
  fill="white"
  fontSize={16}
  fontFamily={'Helvetica'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerPhysical}
</text>


{/* SKL */}
<path d="M228.531 210.411C228.569 211.093 228.73 211.647 229.013 212.072C229.553 212.869 230.505 213.267 231.869 213.267C232.48 213.267 233.037 213.18 233.539 213.005C234.51 212.667 234.996 212.061 234.996 211.188C234.996 210.534 234.791 210.067 234.382 209.789C233.967 209.516 233.318 209.279 232.434 209.077L230.806 208.709C229.742 208.469 228.989 208.204 228.547 207.915C227.783 207.413 227.401 206.663 227.401 205.665C227.401 204.584 227.775 203.698 228.522 203.005C229.27 202.312 230.328 201.966 231.698 201.966C232.958 201.966 234.027 202.271 234.906 202.882C235.789 203.488 236.231 204.459 236.231 205.795H234.701C234.619 205.152 234.445 204.658 234.177 204.314C233.681 203.687 232.838 203.373 231.648 203.373C230.688 203.373 229.998 203.575 229.578 203.979C229.158 204.382 228.948 204.852 228.948 205.386C228.948 205.975 229.193 206.406 229.684 206.679C230.006 206.854 230.735 207.072 231.869 207.334L233.555 207.719C234.368 207.904 234.996 208.158 235.437 208.48C236.201 209.042 236.583 209.857 236.583 210.927C236.583 212.258 236.098 213.21 235.126 213.783C234.161 214.355 233.037 214.642 231.755 214.642C230.26 214.642 229.09 214.26 228.244 213.496C227.398 212.738 226.984 211.709 227 210.411H228.531ZM238.645 202.268H240.233V208.128L246.093 202.268H248.343L243.343 207.113L248.482 214.29H246.363L242.156 208.259L240.233 210.1V214.29H238.645V202.268ZM249.824 202.268H251.453V212.858H257.541V214.29H249.824V202.268Z" fill="#9C70FA"/>


{/* SKL Rating */}

<text
  x={262}
  y={202.5}
  fill="white"
  fontSize={16}
  fontFamily={'Helvetica'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerSkills}
</text>


{/* Outer White Frame */}
<path d="M125.4 403.21C91.73 403.21 64.51 391.47 55.84 387.26V99.97C73.36 99.16 128.57 94.54 186.55 68.02C204.1 59.99 223.09 55.93 242.99 55.93C276.66 55.93 303.88 67.67 312.54 71.88V359.18C295.02 359.99 239.81 364.61 181.83 391.13C164.28 399.16 145.29 403.22 125.4 403.22V403.21Z" stroke="url(#paint14_linear_29_6)" stroke-width="2" stroke-miterlimit="10"/>


{/* "Player" */}
<text
  x={245}
  y={345}
  fill="#9C70FA"
  fontSize={10}
  fontFamily={'Helvetica'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {"PLAYER"}
</text>



{/* Sport's Name */}
<text
  x={237}
  y={335}
  fill="#9C70FA"
  fontSize={10}
  fontFamily={'Helvetica'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {"FOOTBALL"}
</text>


{/* Sport's Logo */}
<path d="M279.79 306.68L274.21 304.2L268.81 307.32L268.2 306.26L273.6 303.14L274.24 297.08C272.57 295.63 270.64 294.51 268.55 293.79L263.61 297.38V303.61H262.39V297.37L257.46 293.78C255.37 294.5 253.44 295.61 251.77 297.07L252.41 303.13L257.81 306.25L257.2 307.31L251.8 304.19L246.22 306.67C246.01 307.74 245.89 308.84 245.89 309.95C245.89 311.06 246 312.16 246.22 313.23L251.8 315.71L257.2 312.59L257.81 313.65L252.41 316.77L251.77 322.83C253.44 324.28 255.37 325.4 257.46 326.12L262.4 322.53V316.29H263.62V322.53L268.55 326.12C270.64 325.4 272.57 324.29 274.24 322.83L273.6 316.77L268.2 313.65L268.81 312.59L274.21 315.71L279.79 313.23C280 312.16 280.11 311.06 280.11 309.95C280.11 308.84 279.99 307.74 279.78 306.67L279.79 306.68ZM266.4 315.84H259.62L256.23 309.97L259.62 304.1H266.4L269.79 309.97L266.4 315.84Z" fill="white"/>


{/* White Circle Around the Sport's Logo */}
<path d="M263.01 290.42C252.21 290.42 243.46 299.17 243.46 309.97C243.46 320.77 252.21 329.52 263.01 329.52C273.81 329.52 282.56 320.77 282.56 309.97C282.56 299.17 273.81 290.42 263.01 290.42ZM277 321.81C274.25 325.06 270.44 327.25 266.27 328C265.21 328.19 264.11 328.29 263.01 328.29C261.91 328.29 260.81 328.19 259.74 328C255.58 327.25 251.77 325.05 249.02 321.81C247.6 320.13 246.5 318.23 245.75 316.16C245.04 314.19 244.68 312.1 244.68 309.97C244.68 307.84 245.04 305.75 245.76 303.78C246.5 301.71 247.6 299.81 249.03 298.13C251.78 294.88 255.59 292.69 259.76 291.94C261.88 291.55 264.16 291.55 266.28 291.94C270.44 292.69 274.25 294.89 277 298.13C278.43 299.81 279.52 301.71 280.27 303.78C280.98 305.75 281.34 307.84 281.34 309.97C281.34 312.1 280.98 314.19 280.27 316.16C279.53 318.23 278.43 320.13 277 321.81Z" fill="white"/>


{/* Line Under The Rating */}
<path d="M211.03 174.42H290.09" stroke="white" stroke-miterlimit="10"/>


{/* Player's First Name */}
<text
  x={90}
  y={285}
  fill="white"
  fontSize={33}
  fontFamily={'Kensington'}
  fontStyle={'Italic'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerFirstName}
</text>


{/* Player Second Name */}
<text
  x={90}
  y={320}
  fill="white"
  fontSize={33}
  fontFamily={'Kensington'}
  fontStyle={'Italic'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerLastName}
</text>


{/* Center Attacking text "Position" */}
<text
  x={121}
  y={357}
  fill="#8300FF"
  fontSize={9.13}
  fontFamily={'Kensington'}
  fontStyle={'Italic'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerPosition}
</text>


{/* Short Position Purple Background */}
<path d="M84.42 374.35L88.1 356.67H116.41L112.74 374.35H84.42Z" fill="#8300FF"/>

{/* ShortPosition */}
<text
  x={91}
  y={359}
  fill="white"
  fontSize={14}
  fontFamily={'Kensington'}
  fontStyle={'Italic'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerShortPosition}
</text>


{/* Player Rating */}<text
  x={222}
  y={95}
  fill="white"
  fontSize={90}
  fontFamily={'Kensington'}
  fontStyle={'Italic'}
  fontWeight={'Bold'}
  alignmentBaseline="hanging"
>
  {playerTotalScore}
</text>





</g>
<defs>
<filter id="filter0_d_29_6" x="0.179993" y="0.26297" width="368.04" height="458.614" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="25"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0 0 0 0 0 1 0 0 0 0.5 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_29_6"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_29_6" result="shape"/>
</filter>
<pattern id="pattern0_29_6" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_29_6" transform="scale(0.000458085 0.000333667)"/>
</pattern>
<linearGradient id="paint0_linear_29_6" x1="226.91" y1="301.3" x2="90.28" y2="71.85" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint1_linear_29_6" x1="7.96005" y1="261.68" x2="72.83" y2="110" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint2_linear_29_6" x1="56.29" y1="282.35" x2="121.16" y2="130.68" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint3_linear_29_6" x1="35.94" y1="273.65" x2="100.81" y2="121.97" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint4_linear_29_6" x1="78.9201" y1="292.04" x2="143.79" y2="140.37" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint5_linear_29_6" x1="166.021" y1="81.4946" x2="184.975" y2="37.1839" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint6_linear_29_6" x1="109.241" y1="80.5848" x2="127.405" y2="38.1037" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint7_linear_29_6" x1="223.591" y1="80.5848" x2="241.755" y2="38.1037" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint8_linear_29_6" x1="50.94" y1="280.06" x2="115.81" y2="128.39" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint9_linear_29_6" x1="99.27" y1="300.74" x2="164.14" y2="149.06" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint10_linear_29_6" x1="147.61" y1="321.41" x2="212.48" y2="169.73" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint11_linear_29_6" x1="30.59" y1="271.36" x2="95.4601" y2="119.69" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint12_linear_29_6" x1="104.62" y1="303.02" x2="169.49" y2="151.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#9100FF" stop-opacity="0"/>
<stop offset="1" stop-color="#9100FF"/>
</linearGradient>
<linearGradient id="paint13_linear_29_6" x1="184.52" y1="204.55" x2="182.72" y2="342.43" gradientUnits="userSpaceOnUse">
<stop stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>
<linearGradient id="paint14_linear_29_6" x1="127.1" y1="72.71" x2="241.29" y2="386.43" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="#9C70FA"/>
</linearGradient>
</defs>

</svg>
      </div>
  </>
  );
};

export default PlayerCard;
