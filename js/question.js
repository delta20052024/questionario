const steps = [	
    { 
        title: "Informazioni generali ", 
        description: "se serve, qui ci va un sotto titolo",

            questions: [
              {
                id: 1,
                q: "Da quanti anni lavori in Azienda?",
                tp: "radio",
                options: [
                  "Meno di 1 anno",
                  "Da 1 a 5 anni",
                  "Da 6 a 10 anni",
                  "Da 11 a 20 anni",
                  "Più di 20 anni"
                ]
              },
              {
                id: 2,
                q: "Qual è il tuo livello di istruzione?",
                tp: "radio",
                options: [
                  "Licenza elementare",
                  "Licenza media",
                  "Diploma",
                  "Laurea triennale",
                  "Laurea specialistica",
                  "Master",
                  "Dottorato"
                ]
              },
              {
                id: 3,
                q: "In quale Società lavori?",
                tp: "radio",
                options: [
                  "Poste Italiane",
                  "Altre Società del Gruppo Poste"
                ]
              },
              {
                id: 4,
                q: "In quale struttura organizzativa lavori?",
                tp: "radio",
                options: [
                  "Struttura centrale",
                  "Struttura territoriale"
                ]
              },
              {
                id: 5,
                q: "Qual è la tua categoria professionale?",
                tp: "radio",
                options: [
                  "Impiegato",
                  "Quadro",
                  "Dirigente"
                ]
              },
              {
                id: 6,
                q: "Quale è la tua età: indica l'anno di nascita",
                tp: "text"
              },
              {
                id: 7,
                q: "Genere",
                tp: "radio",
                options: [
                  "Uomo",
                  "Donna",
                  "Non binario",
                  "Altro",
                  "Preferisco non specificare"
                ]
              }
            ]
    },
    { 
        title: "Qui ci va un titolo", 
        description: "e, se serve, un sotto titolo",
        questions: [
              {
                id: 8,
                q: "",
                tp: "likert",
                options: [
                    "Ritiene che il suo familiare le chieda un aiuto maggiore rispetto a quello di cui ha bisogno?",
                    "Ritiene di non avere abbastanza tempo per se stesso a causa del tempo impiegato nella cura del suo familiare?",
                    "Si sente stressato dall'avere cura del suo familiare e dal cercare di far fronte alle altre responsabilità?",
                    "Si sente imbarazzato per il comportamento del suo familiare?",
                    "Si sente arrabbiato quando è con il suo familiare?",
                    "Ritiene che il suo familiare influisca attualmente in maniera negativa sul suo rapporto con gli altri membri della famiglia o con gli amici?",
                    "Teme ciò che il futuro riserva al suo familiare?",
                    "Sente che il suo familiare è dipendente da lei?",
                    "Si sente affaticato quando sta dietro al suo familiare?",
                    "Ritiene che la sua salute abbia risentito del prendersi cura del suo familiare?",
                    "Ritiene di non avere l'intimità e la privacy che vorrebbe a causa del suo familiare?",
                    "Ritiene che la sua vita sociale abbia risentito dal prendersi cura del suo familiare?",
                    "Si sente a disagio ad invitare a casa gli amici a causa del suo familiare?",
                    "Si sente a disagio ad invitare a casa gli amici a causa del suo familiare?",
                    "Ritiene che il suo familiare si aspetta che lei si prenda cura di lui come se fosse l'unica persona da cui dipende?",
                    "Sente di non aver abbastanza denaro per prendersi cura del suo familiare in aggiunta alle sue spese personali?",
                    "Pensa di non farcela a prendersi cura del suo familiare ancora per molto?",
                    "Pensa di non avere più il controllo della sua vita dal momento in cui il suo familiare si è ammalato?",
                    "Desidererebbe affidare la cura del suo familiare a qualcun altro?",
                    "Si sente insicuro su cosa fare per il suo familiare?",
                    "Sente che dovrebbe fare di più per il suo familiare?",
                    "Crede che potrebbe fare di meglio nella cura del suo familiare?",
                    "Infine quanto si sente sovraccaricato dall'avere cura del suo familiare?"
                    ],
                values: ["Mai", "Raramente", "Qualche<br>volta", "Spesso", "Sempre"]
              } 
        ]
    }
];

const ranges = [
    { min: 0, max: 20, text: "Carico assistenziale minimo o nullo" },
    { min: 21, max: 40, text: "Carico da lieve a moderato" },
    { min: 41, max: 60, text: "Carico da moderato a grave" },
    { min: 61, max: 88, text: "Grave carico assistenziale" }
];
