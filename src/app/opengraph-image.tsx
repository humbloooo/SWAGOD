import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'SWAGOD | Premium Streetwear';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif'
                }}
            >
                <div style={{ fontSize: 144, fontWeight: '900', color: '#FC6100', marginBottom: 20 }}>SWAGOD</div>
                <div style={{ fontSize: 36, fontFamily: 'monospace', letterSpacing: '0.2em', opacity: 0.6 }}>THE FUTURE OF WEAR</div>
            </div>
        ),
        {
            ...size,
        }
    );
}
