// // app/(flow)/product-scan/camera-scan.tsx
// import React from 'react';
// import { BaseCameraScan } from '@/components/scans/BaseCameraScan';

// export default function ProductCameraScan() {
//     return (
//         <BaseCameraScan
//             scanType="product-scan"
//             title="Scan product barcode or ingredients"
//             subtitle="Position the product label within the frame"
//         />
//     );
// }

// app/(flow)/product-scan/camera-scan.tsx
import React from 'react';
import { BaseProductCameraScan } from '@/components/scans/BaseProductCameraScan';
import { useLocalSearchParams } from 'expo-router';

export default function ProductCameraScan() {
  const { scanType } = useLocalSearchParams();

  return (
    <BaseProductCameraScan
      scanType="product-scan"
      title="Scan product barcode or ingredients"
      subtitle="Position the product label within the frame"
    />
  );
}
