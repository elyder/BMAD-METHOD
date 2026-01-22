
import React from 'react';

export const UKFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="60" height="30" {...props}>
        <clipPath id="a"><path d="M0 0h60v30H0z"/></clipPath>
        <clipPath id="b"><path d="M30 15h30v15H30zM0 0h30v15H0zM30 0h30v15H30zM0 15h30v15H0z"/></clipPath>
        <path d="M0 0v30h60V0z" fill="#00247d"/>
        <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" clipPath="url(#a)"/>
        <path d="M0 0l60 30M60 0L0 30" stroke="#cf142b" strokeWidth="4" clipPath="url(#b)"/>
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth="6"/>
    </svg>
);
