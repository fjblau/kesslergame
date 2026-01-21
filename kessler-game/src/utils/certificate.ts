import { jsPDF } from 'jspdf';
import { brand } from '../config/brand';

interface CertificateData {
  playerName: string;
  finalScore: number;
  grade: string;
  turnsSurvived: number;
  maxTurns: number;
  finalBudget: number;
  satellitesLaunched: number;
  debrisRemoved: number;
  totalDebris: number;
  difficulty: string;
  satelliteLaunchScore: number;
  debrisRemovalScore: number;
  satelliteRecoveryScore: number;
  budgetManagementScore: number;
  survivalScore: number;
}

async function loadImageAsDataURL(imageUrl: string, invert: boolean = false): Promise<{ dataUrl: string; aspectRatio: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        if (invert) {
          ctx.filter = 'brightness(0) invert(1)';
        }
        
        ctx.drawImage(img, 0, 0);
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const dataUrl = canvas.toDataURL('image/png');
        resolve({ dataUrl, aspectRatio });
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = (error) => {
      console.error('Image load error:', error);
      reject(new Error(`Failed to load image from ${imageUrl}`));
    };
    img.src = imageUrl;
  });
}

export async function generateCertificate(data: CertificateData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  const logoPath = brand.assets.certificateLogo;
  const { dataUrl: imageDataUrl, aspectRatio } = await loadImageAsDataURL(logoPath, true);
  const logoHeight = 15;
  const logoWidth = logoHeight * aspectRatio;
  doc.addImage(imageDataUrl, 'PNG', 20, 20, logoWidth, logoHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(96, 165, 250);
  doc.text(brand.text.certificateTitle, pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(24);
  doc.setTextColor(167, 139, 250);
  doc.text(brand.text.certificateSubtitle, pageWidth / 2, 42, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('This certifies that', pageWidth / 2, 55, { align: 'center' });

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(252, 211, 77);
  doc.text(data.playerName, pageWidth / 2, 67, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  const missionText = `has successfully completed a mission in the ${brand.name} Program`;
  doc.text(missionText, pageWidth / 2, 77, { align: 'center' });

  const leftCol = 30;
  const rightCol = pageWidth / 2 + 10;
  let yPos = 95;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 197, 253);
  doc.text('Mission Statistics', pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Performance Grade:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(252, 211, 77);
  doc.text(data.grade, leftCol + 50, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Final Score:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(252, 211, 77);
  doc.text(data.finalScore.toLocaleString() + ' points', rightCol + 50, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Difficulty Level:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1), leftCol + 50, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Turns Survived:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`${data.turnsSurvived} / ${data.maxTurns}`, rightCol + 50, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Final Budget:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('$' + data.finalBudget.toLocaleString(), leftCol + 50, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Satellites Launched:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(data.satellitesLaunched.toString(), rightCol + 50, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Debris Removed:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(data.debrisRemoved.toString() + ' pieces', leftCol + 50, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Final Debris Count:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(data.totalDebris.toString() + ' pieces', rightCol + 50, yPos);
  yPos += 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 197, 253);
  doc.text('Score Breakdown', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Satellite Operations:', leftCol, yPos);
  doc.setTextColor(96, 165, 250);
  doc.text('+' + data.satelliteLaunchScore.toLocaleString(), leftCol + 55, yPos);

  doc.setTextColor(203, 213, 225);
  doc.text('Debris Removal:', rightCol, yPos);
  doc.setTextColor(134, 239, 172);
  doc.text('+' + data.debrisRemovalScore.toLocaleString(), rightCol + 55, yPos);
  yPos += 7;

  doc.setTextColor(203, 213, 225);
  doc.text('Satellite Recovery:', leftCol, yPos);
  doc.setTextColor(103, 232, 249);
  doc.text('+' + data.satelliteRecoveryScore.toLocaleString(), leftCol + 55, yPos);

  doc.setTextColor(203, 213, 225);
  doc.text('Budget Management:', rightCol, yPos);
  doc.setTextColor(253, 224, 71);
  doc.text('+' + data.budgetManagementScore.toLocaleString(), rightCol + 55, yPos);
  yPos += 7;

  doc.setTextColor(203, 213, 225);
  doc.text('Survival:', leftCol, yPos);
  doc.setTextColor(192, 132, 252);
  doc.text('+' + data.survivalScore.toLocaleString(), leftCol + 55, yPos);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text(`Issued on ${dateStr}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

  doc.setFontSize(8);
  doc.text(brand.text.organizationName, pageWidth / 2, pageHeight - 15, { align: 'center' });

  const fileName = `Mission_Complete_${data.playerName.replace(/\s+/g, '_')}_${today.getTime()}.pdf`;
  doc.save(fileName);
}
