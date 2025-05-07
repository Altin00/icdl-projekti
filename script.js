document.addEventListener('DOMContentLoaded', function() {
    let player1, player2;
    let video1Completed = false;
    let video2Completed = false;

    // YouTube API callback
    window.onYouTubeIframeAPIReady = function() {
        player1 = new YT.Player('player1', {
            height: '360',
            width: '640',
            videoId: '0ua8Mg48coA', 
            playerVars: {
                'playsinline': 1
            },
            events: {
                'onStateChange': onPlayerStateChange1
            }
        });
    
        player2 = new YT.Player('player2', {
            height: '360',
            width: '640',
            videoId: 'UOYHwRys6D0',
            playerVars: {
                'playsinline': 1
            },
            events: {
                'onStateChange': onPlayerStateChange2
            }
        });
    }

    function onPlayerStateChange1(event) {
        if (event.data === YT.PlayerState.ENDED) {
            video1Completed = true;
            checkCompletion();
        }
    }

    function onPlayerStateChange2(event) {
        if (event.data === YT.PlayerState.ENDED) {
            video2Completed = true;
            checkCompletion();
        }
    }

    function checkCompletion() {
        if (video1Completed && video2Completed) {
            document.getElementById('certificateContainer').style.display = 'block';
        }
    }

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Certificate generation
    document.getElementById('downloadCertificate').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Set background color
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 297, 210, 'F'); 

        // Add decorative border
        doc.setDrawColor(10, 151, 202);
        doc.setLineWidth(1);
        doc.rect(10, 10, 277, 190); 

        // Add certificate title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(40);
        doc.text('Todistus', 148.5, 60, { align: 'center' });

        // Add certificate text
        doc.setFontSize(24);
        doc.text('ICDL Video-opintokokonaisuus', 148.5, 100, { align: 'center' });
        doc.text('suoritettu', 148.5, 120, { align: 'center' });

        // Add date
        const today = new Date();
        const dateStr = today.toLocaleDateString('fi-FI');
        doc.setFontSize(16);
        doc.text(`Päivämäärä: ${dateStr}`, 148.5, 160, { align: 'center' });

        // Add signature line
        doc.setDrawColor(10, 151, 202);
        doc.line(98.5, 180, 198.5, 180);
        doc.setFontSize(12);
        doc.text('ICDL Suomi', 148.5, 188, { align: 'center' });

        // Save the PDF
        doc.save('icdl-sertifikaatti.pdf');
    });

    // Contact form handling
const contactForm = document.getElementById('contactForm');

// Tee CSV-tallennus juuri ennen lomakkeen normaalia lähetystä
contactForm.addEventListener('submit', function() {
    // ÄLÄ käytä e.preventDefault() – muuten lomakkeen lähetys estyy!

    // Kerää lomakkeen tiedot
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Muodosta CSV-sisältö
    const csvContent = `Etunimi,Sukunimi,Sähköposti,Puhelin,Viesti\n${formData.firstName},${formData.lastName},${formData.email},${formData.phone},"${formData.message}"`;

    // Luo Blob ja linkki latausta varten
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_form_data.csv';

    // Käynnistä lataus
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Formsubmit lähettää nyt lomakkeen normaalisti → sähköposti lähtee!
}) 
}) 
