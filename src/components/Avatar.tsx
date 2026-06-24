import React, { useState } from 'react';

// Headshot with a graceful initials fallback. Renders Adam's photo when
// public/adam-hagestedt.jpg exists; until then (or if it fails to load) it shows
// a tasteful "AH" monogram so the page never looks broken. Drop the file in and
// it appears automatically — no code change required.
export const Avatar: React.FC<{ size?: number }> = ({ size = 88 }) => {
    const [failed, setFailed] = useState(false);
    const dim = { width: size, height: size };

    if (failed) {
        return (
            <div
                style={dim}
                className="rounded-2xl bg-garnet-600 flex items-center justify-center mx-auto shadow-lg"
                role="img"
                aria-label="Adam Hagestedt"
            >
                <span className="text-2xl font-semibold tracking-wide text-ink-50">AH</span>
            </div>
        );
    }

    return (
        <img
            src="/adam-hagestedt.jpg"
            alt="Adam Hagestedt"
            width={size}
            height={size}
            style={dim}
            onError={() => setFailed(true)}
            className="rounded-2xl object-cover ring-1 ring-garnet-400/30 mx-auto shadow-lg"
        />
    );
};
