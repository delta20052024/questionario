document.addEventListener("DOMContentLoaded", function() {
    let currentStep = 0;
    let totalTime = 0;
    let openCount = 0;
    let sessionStartTime = new Date();
    let sessionLog = [];
    let dataSaved = false; // Variabile per tracciare se i dati sono stati salvati

    // Inizializza la proprietà userResponse in ogni domanda
    steps.forEach(step => {
        step.questions.forEach(question => {
            question.userResponse = question.userResponse || null;  // Inizializza la risposta come null se non esiste
        });
    });

    // Variabile per abilitare/disabilitare la pagina di benvenuto
    const enableWelcomePage = true;


    const questionnaireStarted = loadSavedData();

    if (enableWelcomePage && !questionnaireStarted) {
        displayWelcomePage();
    } else {
        showQuestionnaire();
    }

    // Funzione displayWelcomePage
    function displayWelcomePage() {
        const welcomePage = document.getElementById('welcomePage');
        const questionnaireContainer = document.getElementById('questionnaireContainer');

        welcomePage.style.display = 'block'; // Mostra la pagina di benvenuto
        welcomePage.classList.add('show'); // Aggiungi la classe per il fade in

        document.getElementById('startBtn').addEventListener('click', function() {
            welcomePage.classList.remove('show'); // Trigger fade out
            setTimeout(function() {
                welcomePage.style.display = 'none';
                showQuestionnaire(); // Mostra il questionario dopo il fade out
            }, 150); // Assicurati che la durata corrisponda alla transizione Bootstrap
        });
    }

    // Funzione showQuestionnaire
    function showQuestionnaire() {
        const questionnaireContainer = document.getElementById('questionnaireContainer');
        questionnaireContainer.style.display = 'block'; // Mostra il questionario
        setTimeout(function() {
            questionnaireContainer.classList.add('show'); // Trigger fade in
        }, 10);
    }

    // Funzione per mostrare la pagina di uscita in caso di questionario incompleto
	function showIncompleteExitPage() {
		const questionnaireContainer = document.getElementById('questionnaireContainer');
		const incompleteExitPage = document.getElementById('incompleteExitPage');

		// Fade-out del questionario
		questionnaireContainer.classList.remove('show'); // Trigger fade out
		setTimeout(function() {
			questionnaireContainer.style.display = 'none'; // Nascondi il questionario

			// Mostra la pagina di uscita incompleta
			incompleteExitPage.style.display = 'block';
			setTimeout(function() {
				incompleteExitPage.classList.add('show'); // Trigger fade in
			}, 10);
		}, 150); // Durata deve corrispondere alla transizione Bootstrap

		document.getElementById('exitIncompleteBtn').addEventListener('click', function() {
			window.close(); // Chiudi la finestra o esegui altra azione di chiusura
		});
	}

    // Funzione per mostrare la pagina di uscita in caso di questionario completato
	function showCompleteExitPage() {

        const score = 35;
        displayMessagesByScore(score);

		const questionnaireContainer = document.getElementById('questionnaireContainer');
		const completeExitPage = document.getElementById('completeExitPage');

		// Fade-out del questionario
		questionnaireContainer.classList.remove('show'); // Trigger fade out
		setTimeout(function() {
			questionnaireContainer.style.display = 'none'; // Nascondi il questionario

			// Mostra la pagina di uscita completa
			completeExitPage.style.display = 'block';
			setTimeout(function() {
				completeExitPage.classList.add('show'); // Trigger fade in
			}, 10);
		}, 150); // Durata deve corrispondere alla transizione Bootstrap

		document.getElementById('exitCompleteBtn').addEventListener('click', function() {
			window.close(); // Chiudi la finestra o esegui altra azione di chiusura
		});
	}



    function createStepMap() {
        const stepMap = document.querySelector('.step-map');
        steps.forEach((step, index) => {
            const stepCircle = document.createElement('div');
            stepCircle.className = 'step-circle';
            stepCircle.dataset.title = step.title;
            stepCircle.addEventListener('click', () => {
                updateStepMap(index);
                showStep(index);
            });
            if (index === currentStep) stepCircle.classList.add('active');
            stepCircle.innerHTML = `<span>${index + 1}</span>`;
            stepMap.appendChild(stepCircle);
        });
    }

    function updateStepMap(index) {
        const stepCircles = document.querySelectorAll('.step-circle');
        stepCircles.forEach((circle, i) => {
            circle.classList.toggle('active', i === index);
        });
    }

    createStepMap();
    showStep(currentStep);


    // Funzione per mostrare le domande di ogni step
    function renderQuestions(stepIndex) {
        const step = steps[stepIndex];  // Accedi allo step corrente
        const formContainer = document.querySelector('.form-container');

        const stepTitle = `<strong>${step.title}</strong>` + (step.description ? ' - ' + step.description : '');
        document.getElementById('step-title').innerHTML = stepTitle;

        formContainer.innerHTML = '';

        // Iteriamo direttamente sulle domande dello step corrente
        step.questions.forEach((qObj, index) => {
            const selectedValue = qObj.userResponse || '';
            const isRequired = qObj.required ? 'required' : '';
            const requiredClass = qObj.required ? 'is-required' : '';

            let row;

            if (qObj.tp === "radio") {
                let radioButtons = '';
                qObj.options.forEach((option, idx) => {
                    const optionId = `${qObj.n}${idx + 1}`;
                    const checked = selectedValue === option.toLowerCase() ? 'checked' : '';
                    radioButtons += `
                        <div class="form-check">
                            <input id="${optionId}" name="${qObj.n}" type="radio" class="form-check-input" value="${option.toLowerCase()}" ${isRequired} ${checked}>
                            <label class="form-check-label" for="${optionId}">${option}</label>
                        </div>
                    `;
                });

                row = `
                    <div class="col-md-${qObj.w} ${requiredClass} mt-3">
                        <label class="form-label fw-semibold">${qObj.q}</label>
                        ${radioButtons}
                    </div>
                `;
            } else if (qObj.tp === "text") {
                row = `
                        <div class="col-sm-${qObj.w} ${requiredClass} mt-3">
                            <label for="${qObj.n}" class="form-label fw-semibold">${qObj.q}</label>
                            <input type="text" class="form-control" name="${qObj.n}" id="${qObj.n}" placeholder="" value="${selectedValue || ''}" ${isRequired}>
                            <div class="invalid-feedback">Campo obbligatorio</div>
                        </div>
                `;
            } else if (qObj.tp === "email") {
                row = `
                        <div class="col-sm-${qObj.w} ${requiredClass} mt-3">
                            <label for="${qObj.n}" class="form-label fw-semibold">${qObj.q}</label>
                            <input type="email" class="form-control" name="${qObj.n}" id="${qObj.n}" placeholder="" value="${selectedValue || ''}" ${isRequired}>
                            <div class="invalid-feedback">Campo obbligatorio</div>
                        </div>
                `;
            } else if (qObj.tp === "custom-date") {
                			const day = selectedValue ? selectedValue.split("-")[2] : '';
                			const month = selectedValue ? selectedValue.split("-")[1] : '';
                			const year = selectedValue ? selectedValue.split("-")[0] : '';
                
                			row = `
                				<div class="col-sm-${qObj.w} ${requiredClass} mt-3">
                					<label for="${qObj.n}" class="form-label fw-semibold">${qObj.q}</label>
                					<div class="d-flex align-items-center">
                						<div>
                							<input type="number" class="form-control text-center" id="${qObj.n}_dd" maxlength="2" minlength="2" min="1" max="31" placeholder="GG" value="${day}" data-date-part="day" data-parent-id="${qObj.n}" style="width: 80px;" ${isRequired}>
                						</div>
                						<span class="mx-2">/</span>
                						<div>
                							<input type="number" class="form-control text-center" id="${qObj.n}_mm" maxlength="2" minlength="2" min="1" max="12" placeholder="MM" value="${month}" data-date-part="month" data-parent-id="${qObj.n}" style="width: 80px;" ${isRequired}>
                						</div>
                						<span class="mx-2">/</span>
                						<div>
                							<input type="number" class="form-control text-center" id="${qObj.n}_yyyy" maxlength="4" minlength="4" min="1900" max="2099" placeholder="AAAA" value="${year}" data-date-part="year" data-parent-id="${qObj.n}" style="width: 100px;" ${isRequired}>
                						</div>
                					</div>
                					<input type="hidden" name="${qObj.n}" id="${qObj.n}" value="${selectedValue}">
                					<div class="invalid-feedback">Campo obbligatorio</div>
                				</div>
                			`;
            } else if (qObj.tp === "textarea") {
                row = `
                    <div class="row mb-3">
                        <div class="col-sm-${qObj.w} ${requiredClass} mt-3">
                            <label for="${qObj.n}" class="form-label fw-semibold">${qObj.q}</label>
                            <textarea class="form-control" name="${qObj.n}" id="${qObj.n}" rows="2" ${isRequired}>${selectedValue || ''}</textarea>
                            <div class="invalid-feedback">Campo obbligatorio</div>
                        </div>
                    </div>
                `;
            } else if (qObj.tp === "select") {
                row = `
                    <div class="col-sm-${qObj.w} ${requiredClass} mt-3">
                        <label for="${qObj.n}" class="form-label fw-semibold">${qObj.q}</label>
                        <select class="form-select" name="${qObj.n}" id="${qObj.n}" ${isRequired}>
                            <option value="">Scegli...</option>
                            ${qObj.options.map(option => {
                                const selected = selectedValue === option ? 'selected' : '';
                                return `<option value="${option}" ${selected}>${option}</option>`;
                            }).join('')}
                        </select>
                        <div class="invalid-feedback">Campo obbligatorio</div>
                    </div>
                `;
            } else if (qObj.tp === "checkbox") {
                const checked = selectedValue ? 'checked' : '';
                row = `
                    <div class="col-md-${qObj.w} ${requiredClass} mt-3">
                        <div class="form-check">
                            <input id="${qObj.q}" name="${qObj.n}" type="checkbox" class="form-check-input" ${isRequired} ${checked}>
                            <label class="form-check-label fw-semibold" for="${qObj.q}">${qObj.q}</label>
                            <div class="invalid-feedback">Campo obbligatorio</div>
                        </div>
                    </div>
                `;
    		} else if (qObj.tp === "label") {
    			row = `
    				<div class="col-md-${qObj.w} mt-3">
    					<label class="form-label fw-semibold">${qObj.q}</label>
    				</div>
    			`;
    		} else if (qObj.tp === "box") {
    			// Sostituisce i caratteri di a capo con <br>
    			const formattedText = qObj.q.replace(/\n/g, '<br>');

    			row = `
    				<div class="col-12 mt-3">
    					<div class="p-3 rounded" style="background-color:#e9ecef;">
    						${formattedText}
    					</div>
    				</div>
    			`;
    		} else if (qObj.tp === "likert") {
                row = `<label class="form-label fw-semibold">${qObj.q}</label>`;
                row += `
                <div class="col-md-${qObj.w} mt-3">
                    <table class="table table-striped tablde-sm table-bfordered table-likert" data-type="likert" data-name="${qObj.n}">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 60%"></th>`;
                
                // Creiamo le intestazioni della tabella con i valori Likert
                qObj.values.forEach(value => {
                    row += `<th scope="col" class="text-center" style="width: ${(40 / qObj.values.length)}%">${value}</th>`;
                });
                
                row += `</tr>
                        </thead>
                        <tbody>`;
                
                // Creiamo le righe della tabella per ogni opzione
                qObj.options.forEach(option => {
                    row += `<tr>
                            <td scope="row" class="text-end">${option}</td>`;
                    
                    // Creiamo i radio button per ogni valore della scala Likert
                    qObj.values.forEach(value => {
                        const radioName = `${option}_${qObj.n}`; // Concatenazione di nome e opzione
                        const radioId = `${radioName}_${value}`;

                        // Verifica se c'è una risposta salvata e impostiamo il radio button come selezionato
                        const isChecked = qObj.userResponse && qObj.userResponse[option] === value ? 'checked' : '';

                        row += `
                            <td class="text-center">
                                <input type="radio" id="${radioId}" name="${radioName}" value="${value}" style="transform:scale(1.2)" ${isRequired} ${isChecked}>
                            </td>`;
                    });
                    
                    row += `</tr>`;
                });
            
                row += `
                        </tbody>
                    </table>
                </div>`;
            }


            formContainer.innerHTML += row;
        });

        // Aggiungi listener per salvare le risposte nelle proprietà userResponse
        formContainer.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
            input.addEventListener('input', function() {
                const question = findQuestionByName(this.name);
                if (question) {
                    question.userResponse = this.value; // Salva il valore dell'input direttamente nel JSON
                }
            });
        });

        formContainer.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', function() {
                const question = findQuestionByName(this.name);
                if (question) {
                    question.userResponse = this.value; // Salva il valore del radio button selezionato
                }
            });
        });

        formContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', function() {
                const question = findQuestionByName(this.name);
                if (question) {
                    question.userResponse = this.checked; // Salva lo stato della checkbox (true/false)
                }
            });
        });

        formContainer.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', function() {
                const question = findQuestionByName(this.name);
                if (question) {
                    question.userResponse = this.value; // Salva il valore selezionato
                }
            });
        });

        setupCustomDateListeners();

        // Imposta il listener globale per la tabella Likert
        setupLikertListeners();
    }

    function setupLikertListeners() {
        // Trova tutte le tabelle Likert nel DOM
        const likertTables = document.querySelectorAll('table[data-type="likert"]');
        
        likertTables.forEach(likertTable => {
            // Ottieni il nome della domanda dalla tabella tramite data-name
            const questionName = likertTable.getAttribute('data-name');
            
            // Aggiungi un listener delegato sulla tabella per monitorare i cambiamenti sui radio button
            likertTable.addEventListener('change', function(event) {
                const target = event.target;
                
                // Assicuriamoci che l'elemento target sia un input radio
                if (target && target.type === 'radio') {
                    const radioName = target.name;  // Es. "Italiano_livello"
                    const optionName = radioName.split('_')[0];  // Es. "Italiano"
                    
                    // Trova la domanda nella struttura dati globale utilizzando questionName
                    const question = findQuestionByName(questionName);
                    
                    // Assicurati che la domanda esista
                    if (question && question.options.includes(optionName)) {
                        question.userResponse = typeof question.userResponse === 'object' && question.userResponse !== null ? question.userResponse : {};
                        question.userResponse[optionName] = target.value;  // Salva la risposta per l'opzione corrente
                    }
                }
            });
        });
    }

    
    function setupCustomDateListeners() {
        const dateInputs = document.querySelectorAll('input[data-date-part]');
        
        dateInputs.forEach(input => {
            input.addEventListener('input', function() {
                const parentId = this.getAttribute('data-parent-id');
                const day = document.querySelector(`#${parentId}_dd`).value.padStart(2, '0');
                const month = document.querySelector(`#${parentId}_mm`).value.padStart(2, '0');
                const year = document.querySelector(`#${parentId}_yyyy`).value;

                const hiddenInput = document.getElementById(parentId);

                if (day && month && year) {
                    hiddenInput.value = `${year}-${month}-${day}`;
                } else {
                    hiddenInput.value = '';
                }

                //const index = questions.findIndex(q => q.n === this.parentId);
                const question = findQuestionByName(parentId);
                if (question) {
                    question.userResponse = hiddenInput.value; // Salva il valore selezionato
                }
            });
        });
    }



    function showStep(stepIndex) {
        const stepElement = document.querySelector('.step');
        const btnContainer = document.querySelector('.btn-container');
        const stepMap = document.querySelector('.step-map');

        stepElement.classList.remove('show');
        btnContainer.classList.remove('show');
        stepMap.classList.remove('show');

        setTimeout(() => {
            renderQuestions(stepIndex);

            document.getElementById('prevBtn').disabled = stepIndex === 0;
            document.getElementById('nextBtn').disabled = stepIndex === steps.length - 1;

            currentStep = stepIndex;

            stepElement.classList.add('fade');
            btnContainer.classList.add('fade');
            stepMap.classList.add('fade');
            stepElement.classList.add('show');
            btnContainer.classList.add('show');
            stepMap.classList.add('show');
        }, 300);
    }

    document.getElementById('prevBtn').addEventListener('click', () => nextPrev(-1));
    document.getElementById('nextBtn').addEventListener('click', () => nextPrev(1));

    function nextPrev(direction) {
        const newStep = currentStep + direction;
        if (newStep >= 0 && newStep < steps.length) {
            updateStepMap(newStep);
            showStep(newStep);
        }
    }

    document.getElementById('questionario_form').addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmission();
    });

	function handleBeforeUnload(event) {
		if (!dataSaved && unsavedChangesExist()) {
			event.preventDefault();
			event.returnValue = '';
			handleFormSubmission();
		}
	}

    function handleFormSubmission() {
        // Verifica se ci sono domande obbligatorie incomplete
        const incompleteQuestions = steps.some(step => {
            return step.questions.some(qObj => {
                return qObj.required && 
                       (qObj.userResponse === null || 
                        qObj.userResponse === undefined || 
                        qObj.userResponse === '');
            });
        });
    
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalPrimaryButton = document.getElementById('modalPrimaryButton');
        const modalSecondaryButton = document.getElementById('modalSecondaryButton');
    
        if (incompleteQuestions) {
            // Configurazione del modale per l'avviso di incompletezza
            modalTitle.textContent = "Attenzione";
            modalMessage.textContent = "Il questionario non è completo. Per poterlo inviare devi prima rispondere a tutte le domande obbligatorie.";
            modalPrimaryButton.textContent = "OK";
            modalPrimaryButton.onclick = function() {
                modal.hide(); // Chiudi il modale
            };
            modalSecondaryButton.style.display = "none"; // Nascondi il pulsante secondario
        } else {
            // Configurazione del modale per la conferma di invio
            modalTitle.textContent = "Conferma invio";
            modalMessage.textContent = "Hai completato il questionario. Vuoi inviare le risposte? Dopo l'invio, non sarà più possibile modificarle.";
            modalPrimaryButton.textContent = "Invia";
            modalPrimaryButton.onclick = function() {
                incrementOpenCount();
                saveData('complete', true);
                modal.hide(); // Chiudi il modale
                showCompleteExitPage(); // Mostra la pagina di uscita completa
            };
            modalSecondaryButton.style.display = "block"; // Mostra il pulsante secondario
            modalSecondaryButton.textContent = "Annulla";
            modalSecondaryButton.onclick = function() {
                modal.hide(); // Chiudi il modale
            };
        }
    
        modal.show(); // Mostra il modale con la configurazione appropriata
    }
    
    
    


    function saveData(status, isComplete = false) {
        const sessionEndTime = new Date();
        const sessionDuration = (sessionEndTime - sessionStartTime) / 1000;
        totalTime += sessionDuration;
    
        sessionLog.push({
            startTime: sessionStartTime.toISOString(),
            endTime: sessionEndTime.toISOString(),
            duration: sessionDuration
        });
    
        // Creiamo un array di oggetti che contengono sia il testo della domanda che la risposta
        const savedSteps = steps.map(step => {
            return {
                title: step.title,
                description: step.description,
                questions: step.questions.map(qObj => {
                    return {
                        questionText: qObj.q,  // Salviamo il testo della domanda
                        response: qObj.userResponse !== undefined ? qObj.userResponse : null  // Preleviamo la risposta dalla proprietà userResponse
                    };
                })
            };
        });
    
        const questionnaireData = {
            savedSteps: savedSteps,  // Salvare l'intera struttura degli step con le domande
            status: status,
            currentStep: currentStep,
            totalTime: totalTime,
            openCount: openCount,
            sessionLog: sessionLog,
            completionTime: isComplete ? sessionEndTime.toISOString() : null
        };
    

            localStorage.setItem('questionnaire_data', JSON.stringify(questionnaireData));

    }
    
    








    function findQuestionByName(name) {
        for (const step of steps) {
            const question = step.questions.find(q => q.n === name);
            if (question) return question;
        }
        return null;
    }

// Funzione per il caricamento dei dati salvati
function loadSavedData() {
    let savedData = null;

    savedData = JSON.parse(localStorage.getItem('questionnaire_data'));

    if (savedData) {
        // Ripristina le risposte salvate
        savedData.savedSteps.forEach((savedStep, stepIndex) => {
            steps[stepIndex].questions.forEach((question, questionIndex) => {
                question.userResponse = savedStep.questions[questionIndex] ? savedStep.questions[questionIndex].response : '';
            });
        });
        currentStep = savedData.currentStep || 0;
        totalTime = savedData.totalTime || 0;
        openCount = savedData.openCount || 0;
        sessionLog = savedData.sessionLog || [];

        return true; // Dati caricati con successo
    }

    return false; // Nessun dato salvato trovato
}






    function incrementOpenCount() {
        openCount++;
    }

    function unsavedChangesExist() {
        return userResponses.includes(null) || totalTime > 0;
    }

	// Aggiungi l'event listener per gestire la chiusura della finestra
	window.addEventListener("beforeunload", handleBeforeUnload);
});




function displayMessagesByScore(score) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = ''; // Svuota il contenuto precedente

    ranges.forEach(range => {
        // Crea un elemento div per ogni messaggio
        const messageElement = document.createElement('div');
        messageElement.textContent = range.text;

        // Se il punteggio rientra nell'intervallo, metti il testo in evidenza
        if (score >= range.min && score <= range.max) {
            messageElement.style.fontWeight = 'bold';
            messageElement.style.color = 'red';  // Colore in evidenza
        }

        // Aggiungi il messaggio al contenitore
        messageContainer.appendChild(messageElement);
    });
}