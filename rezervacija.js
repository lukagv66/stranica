var navLinks = document.getElementById("navLinks");

            function showMenu(){
                navLinks.style.right = "0";
            }
            function hideMenu(){
                navLinks.style.right = "-300px";
            }

            // Prikaz spremljenih rezervacija
            function displayReservations() {
                const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                const listDiv = document.getElementById('reservationsList');
                listDiv.innerHTML = '';

                if (reservations.length === 0) {
                    listDiv.innerHTML = '<p>Nemate spremljenih rezervacija.</p>';
                    return;
                }

                const ul = document.createElement('ul');
                reservations.forEach((res, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${res.ime}</strong> - ${res.email} - ${res.telefon}<br>
                        Broj osoba: ${res.brojOsoba}, Datum: ${res.datum}, Vrijeme: ${res.vrijeme}<br>
                        <button onclick="deleteReservation(${index})">Obriši</button>
                    `;
                    ul.appendChild(li);
                });
                listDiv.appendChild(ul);
            }

            // Brisanje rezervacije
            function deleteReservation(index) {
                let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                reservations.splice(index, 1);
                localStorage.setItem('reservations', JSON.stringify(reservations));
                displayReservations();
                showMessage('Rezervacija obrisana.', 'success');
            }

            // Validacija i spremanje rezervacije
            document.getElementById('reservationForm').addEventListener('submit', function(event) {
                event.preventDefault();

                const ime = document.getElementById('ime').value.trim();
                const email = document.getElementById('email').value.trim();
                const telefon = document.getElementById('telefon').value.trim();
                const brojOsoba = document.getElementById('brojOsoba').value;
                const datum = document.getElementById('datum').value;
                const vrijeme = document.getElementById('vrijeme').value;

                // Validacija
                if (!ime || !email || !telefon || !brojOsoba || !datum || !vrijeme) {
                    showMessage('Molimo ispunite sva polja.', 'error');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showMessage('Unesite valjanu email adresu.', 'error');
                    return;
                }

                const phoneRegex = /^\+?\d{9,15}$/;
                if (!phoneRegex.test(telefon.replace(/\s/g, ''))) {
                    showMessage('Unesite valjan broj telefona.', 'error');
                    return;
                }

                const selectedDate = new Date(datum + 'T' + vrijeme);
                const now = new Date();
                if (selectedDate <= now) {
                    showMessage('Datum i vrijeme moraju biti u budućnosti.', 'error');
                    return;
                }

                // Spremanje u localStorage
                const reservation = {
                    ime,
                    email,
                    telefon,
                    brojOsoba: parseInt(brojOsoba),
                    datum,
                    vrijeme,
                    timestamp: new Date().toISOString()
                };

                let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                reservations.push(reservation);
                localStorage.setItem('reservations', JSON.stringify(reservations));

                showMessage('Rezervacija je uspješno spremljena!', 'success');

                // Reset forme
                document.getElementById('reservationForm').reset();

                // Osvježi listu
                displayReservations();
            });

            function showMessage(text, type) {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = text;
                messageDiv.className = type;
                setTimeout(() => {
                    messageDiv.textContent = '';
                    messageDiv.className = '';
                }, 5000);
            }

            // Prikaz rezervacija na učitavanje stranice
            window.onload = displayReservations;