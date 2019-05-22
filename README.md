## Oprogramowanie pozwalające na przeprowadzanie poniższych akcji, za pośrednictwem komend głosowych, na zasobach strony youtube: 
- wyszukiwanie,
- pauzowanie,
- wznawianie,
- wczytywanie z bazych danych,
- zapisywanie w bazie danych,
- kasowanie z bazy danych,
- pomijanie aktualnego filmu/utworu,
- cofanie się do poprzedniej strony
### Całość tego rozwiązania opiera się na node.js oraz poniższych modułach: 
- express,
- puppeteer (tzw. headless browser),
- mysql 
- socket.io

### Dodatkowo, po stronie klienta, wykorzystywana jest biblioteka annyang oraz obiekt SpeechSynthesis przeglądarki, który służy do generowania zwrotnych komunikatów głosowych. 
