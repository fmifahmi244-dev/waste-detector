// Data edukasi per kategori sampah
export const wasteCategories = {
  organik: {
    id: 'organik',
    label: 'Organik',
    emoji: '🌿',
    color: 'organik',
    description:
      'Sampah organik berasal dari makhluk hidup dan dapat terurai secara alami oleh mikroorganisme.',
    examples: [
      'Sisa makanan (nasi, lauk, buah)',
      'Kulit buah & sayuran',
      'Daun kering & ranting',
      'Ampas kopi & teh',
      'Kertas bekas tidak berlapis',
    ],
    disposal: [
      'Masukkan ke tempat sampah hijau 🟢',
      'Bisa dijadikan kompos / pupuk organik',
      'Biogas dari sisa makanan',
      'Hindari mencampur dengan plastik',
    ],
    impact:
      'Jika dikelola dengan benar, sampah organik dapat menjadi sumber daya berharga seperti kompos dan energi biogas yang ramah lingkungan.',
    recycleTime: '2 minggu – 6 bulan',
  },
  anorganik: {
    id: 'anorganik',
    label: 'Anorganik',
    emoji: '♻️',
    color: 'anorganik',
    description:
      'Sampah anorganik berasal dari bahan non-hayati dan sulit terurai, namun sebagian besar dapat didaur ulang.',
    examples: [
      'Botol & kemasan plastik',
      'Kaleng minuman & makanan',
      'Kertas karton & kardus',
      'Botol kaca',
      'Logam & besi bekas',
    ],
    disposal: [
      'Masukkan ke tempat sampah biru 🔵',
      'Cuci bersih sebelum dibuang',
      'Pisahkan berdasarkan jenis material',
      'Jual ke bank sampah atau pengepul',
    ],
    impact:
      'Daur ulang sampah anorganik dapat menghemat energi hingga 95% dibanding produksi bahan baku baru, sekaligus mengurangi pencemaran lingkungan.',
    recycleTime: '10 – 1.000 tahun (jika tidak didaur ulang)',
  },
  residu: {
    id: 'residu',
    label: 'Residu',
    emoji: '⚠️',
    color: 'residu',
    description:
      'Sampah residu adalah sampah yang tidak dapat didaur ulang maupun terurai dengan mudah dan memerlukan penanganan khusus.',
    examples: [
      'Popok sekali pakai',
      'Styrofoam / gabus',
      'Kemasan berlapis / sachet',
      'Puntung rokok',
      'Kain dan tekstil tercemar',
    ],
    disposal: [
      'Masukkan ke tempat sampah merah/hitam 🔴',
      'Jangan dibakar sembarangan',
      'Bawa ke TPA atau fasilitas khusus',
      'Kurangi penggunaan produk residu',
    ],
    impact:
      'Sampah residu yang tidak dikelola dapat mencemari tanah dan air tanah selama ratusan tahun. Upayakan meminimalkan penggunaan produk residu.',
    recycleTime: '50 – 500+ tahun',
  },
};

export const getCategoryData = (label) => {
  if (!label) return null;
  const key = label.toLowerCase();
  return wasteCategories[key] || null;
};
