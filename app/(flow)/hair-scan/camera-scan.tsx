// // app/(flow)/hair-scan/camera-scan.tsx
// import React from 'react';
// import { BaseCameraScan } from '@/components/scans/BaseCameraScan';

// export default function HairCameraScan() {
//   return (
//     <BaseCameraScan
//       scanType="hair-scan"
//       title="Position your hair and scalp within the frame"
//       subtitle="Ensure good lighting for accurate analysis"
//     />
//   );
// }

// app/(flow)/hair-scan/camera-scan.tsx
import React from 'react';
import { BaseCameraScan } from '@/components/scans/BaseCameraScan';

export default function HairCameraScan() {
  return (
    <BaseCameraScan
      scanType="hair-scan"
      title="Take a photo of your hair and scalp"
      subtitle="Make sure your hair is visible and lighting is good"
    />
  );
}
