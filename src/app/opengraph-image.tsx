import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'CrimInsight AI — AI Study Assistant for Criminology Students';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #FFFFFF 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: 'white',
            fontSize: 48,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          C
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#0F172A', display: 'flex' }}>
          CrimInsight AI
        </div>
        <div style={{ fontSize: 28, color: '#475569', marginTop: 16, display: 'flex' }}>
          Study Criminology Smarter, with AI
        </div>
      </div>
    ),
    { ...size }
  );
}
