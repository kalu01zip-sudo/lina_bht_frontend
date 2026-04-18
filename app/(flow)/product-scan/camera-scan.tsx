// // app/(flow)/product-scan/camera-scan.tsx
// import React from 'react';
// import { BaseProductCameraScan } from '@/components/scans/BaseProductCameraScan';
// import { useLocalSearchParams } from 'expo-router';

// export default function ProductCameraScan() {
//   const { scanType } = useLocalSearchParams();

//   return (
//     <BaseProductCameraScan
//       scanType="product-scan"
//       title="Scan product barcode or ingredients"
//       subtitle="Position the product label within the frame"
//     />
//   );
// }

// app/(flow)/product-scan/camera-scan.tsx
import React from 'react';
import { BaseProductCameraScan } from '@/components/scans/BaseProductCameraScan';
import { useLocalSearchParams } from 'expo-router';
import { BarcodeScanningResult } from 'expo-camera';

export default function ProductCameraScan() {
  const { scanType } = useLocalSearchParams();

  const handleBarcodeScanned = (barcodeData: BarcodeScanningResult) => {
    console.log('Product barcode scanned:', barcodeData);
    // You can add custom logic here before navigation
    // For example: validate barcode format, check against database, etc.
  };

  return (
    <BaseProductCameraScan
      scanType="product-scan"
      title="Scan product barcode"
      subtitle="Position the barcode within the frame for automatic detection"
      onBarcodeScanned={handleBarcodeScanned}
      enableAutoScan={true}
    />
  );
}
