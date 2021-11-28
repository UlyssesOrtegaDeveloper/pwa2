window.onload = function () {
    document.getElementById("exportFacturaPDF")
        .addEventListener("click", () => {
            const invoice = this.document.getElementById("facturaPDF");
            console.log(facturaPDF);
            console.log(window);
            var opt = {
                margin: 0.3,
                filename: 'miFactura.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(invoice).set(opt).save();
        })
}