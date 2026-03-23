import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateESGReport = async (userData) => {
    if (!userData) {
        alert('Missing calculation data for report');
        return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const dateStr = new Date(userData.date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Attempt to load and convert Growlity logo dynamically
    let logoDataUrl = null;
    let logoWidth = 0;
    try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = "/assets/Growlity-Logo.webp";
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        logoDataUrl = canvas.toDataURL("image/png");
        
        // Fixed height of 18mm, proportional width
        logoWidth = (img.width / img.height) * 18; 
    } catch (err) {
        console.warn("Could not load logo for PDF:", err);
    }

    // --- 1. HEADER BANNER ---
    // Dark sleek header
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 35, 'F');
    
    // App Name / Logo Text
    if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', 15, 8, logoWidth, 18);
    } else {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("GROWLITY", 15, 22);
    }
    
    // Document Title
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("ENTERPRISE CARBON ASSESSMENT", 195, 22, { align: "right" });

    // --- 2. COMPANY PROFILE SECTION ---
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Entity Profile", 15, 50);

    // Add thin separator line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 53, 195, 53);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);

    // Left Column
    doc.text("Organization:", 15, 62);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(userData.entity || userData.companyName || 'Unknown', 45, 62);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Industry:", 15, 69);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(userData.fullData?.industry || 'Manufacturing', 45, 69);

    // Right Column
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Report Date:", 110, 62);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(dateStr, 140, 62);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Employees:", 110, 69);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text((userData.fullData?.employees || 0).toString(), 140, 69);

    // --- 3. KEY METRICS (Boxes) ---
    const boxY = 85;
    
    // Box 1: Annual Projection
    doc.setFillColor(248, 250, 252); 
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, boxY, 56, 25, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Annual Projection", 43, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // green
    doc.text(`${((userData.fullData?.results?.annual) || ((userData.total * 12))).toFixed(1)} tCO2`, 43, boxY + 18, { align: 'center' });

    // Box 2: Total Monthly
    doc.setFillColor(248, 250, 252); 
    doc.roundedRect(77, boxY, 56, 25, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Total Monthly", 105, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // blue
    doc.text(`${(userData.total || 0).toFixed(2)} tCO2`, 105, boxY + 18, { align: 'center' });

    // Box 3: Target Risk Profile
    doc.setFillColor(248, 250, 252); 
    doc.roundedRect(139, boxY, 56, 25, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Risk Profile", 167, boxY + 7, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    
    const riskLevel = userData.risk || 'Low';
    let riskColor = [22, 163, 74]; // default green
    if (riskLevel === 'Medium') riskColor = [202, 138, 4]; // yellow
    if (riskLevel === 'High') riskColor = [220, 38, 38]; // red
    
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(riskLevel.toUpperCase(), 167, boxY + 18, { align: 'center' });

    // --- 4. DATA TABLES ---
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Emissions Breakdown", 15, 130);
    doc.line(15, 133, 195, 133);

    const s1 = (userData.s1 * 1000) || 0;
    const s2 = (userData.s2 * 1000) || 0;
    const s3 = (userData.s3 * 1000) || 0;
    const offsetCost = userData.fullData?.results?.offsetCost || 0;
    const perEmployee = userData.fullData?.results?.perEmployee || 0;

    const tableData = [
        ["Scope 1", "Direct Combustion & Fleet", `${s1.toFixed(1)} kg CO2`],
        ["Scope 2", "Purchased Grid Electricity", `${s2.toFixed(1)} kg CO2`],
        ["Scope 3", "Value Chain & Travel", `${s3.toFixed(1)} kg CO2`],
        ["", "Est. Carbon Offset Cost", `$${offsetCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / yr`],
        ["", "Per Employee Avg", `${perEmployee.toFixed(1)} kg CO2 / yr`]
    ];

    autoTable(doc, {
        startY: 140,
        head: [['Category', 'Description', 'Measured Output']],
        body: tableData,
        theme: 'plain',
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
        bodyStyles: { textColor: [71, 85, 105] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold', textColor: [15, 23, 42] },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: function(data) {
            if (data.row.index >= 3) {
                data.cell.styles.fillColor = [255, 255, 255]; // clear bg for summary
            }
        }
    });

    const finalY = doc.lastAutoTable.finalY || 190;

    // --- 5. AI RECOMMENDATIONS ---
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Strategic Recommendations", 15, finalY + 15);
    doc.line(15, finalY + 18, 195, finalY + 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    
    let recText = "";
    if (riskLevel === 'High') {
        recText = "• Immediate action is required to meet regulatory baselines.\n• We highly advise a formal ESG consultation to set a Net-Zero target.\n• Overhaul heavy vehicle operations to hybrid/EV models.\n• Procure 100% renewable energy for primary facilities.";
    } else if (riskLevel === 'Medium') {
        recText = "• Solid performance baseline established, but optimization is required.\n• Conduct comprehensive energy audits for your corporate buildings.\n• Plan a transition strategy for hybrid/electric supply chain fleets.\n• Increase resource efficiency to offset Scope 3 costs.";
    } else {
        recText = "• Excellent footprint. Your entity operates well below industry emission averages.\n• Focus on long-term sustainability modeling.\n• Investigate verified carbon offset projects to achieve Carbon Neutrality.\n• Continue monitoring to maintain current metrics.";
    }
    
    doc.text(recText, 15, finalY + 28, { lineHeightFactor: 1.6 });

    // --- 6. FOOTER ---
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, 195, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const entityName = userData.entity || userData.companyName || 'Unknown';
    doc.text(`CONFIDENTIAL - Generated by the Growlity SaaS Platform | Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 15, pageHeight - 14);
    doc.text("growlity.com", 195, pageHeight - 14, { align: "right" });

    // Download
    doc.save(`${entityName.replace(/\s+/g, '_')}_ESG_Report.pdf`);
};
