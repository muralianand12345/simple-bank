async function depositMoney() {
    let amountElement = document.getElementById('amount') as HTMLInputElement;
    let amount = amountElement.value;
    let sessionAuth = document.cookie.replace(/(?:(?:^|.*;\s*)sessionAuth\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    await fetch('/db/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': sessionAuth
        },
        body: JSON.stringify({ "amount": amount })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.updatedBank && data.updatedBank.balance !== undefined) {
                let bankBalanceElement = document.getElementById('bank-balance') as HTMLElement;
                if (bankBalanceElement) {
                    bankBalanceElement.innerText = 'Rs ' + data.updatedBank.balance;
                }
            } else {
                console.error('Invalid response structure:', data);
            }
        })
        .catch(error => {
            console.error('Error handling deposit:', error);
        });
}

async function withdrawMoney() {
    let amountElement = document.getElementById('amount') as HTMLInputElement;
    let amount = amountElement.value;
    let sessionAuth = document.cookie.replace(/(?:(?:^|.*;\s*)sessionAuth\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    await fetch('/db/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': sessionAuth
        },
        body: JSON.stringify({ "amount": amount })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.updatedBank && data.updatedBank.balance !== undefined) {
                let bankBalanceElement = document.getElementById('bank-balance') as HTMLElement;
                if (bankBalanceElement) {
                    bankBalanceElement.innerText = 'Rs ' + data.updatedBank.balance;
                }
            } else {
                console.error('Invalid response structure:', data);
            }
        })
        .catch(error => {
            console.error('Error handling withdraw:', error);
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    let sessionAuth = document.cookie.replace(/(?:(?:^|.*;\s*)sessionAuth\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    await fetch('/db/balance', {
        headers: {
            'x-api-key': sessionAuth
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.balance !== undefined) {
                let bankBalanceElement = document.getElementById('bank-balance') as HTMLElement;
                if (bankBalanceElement) {
                    bankBalanceElement.innerText = 'Rs ' + data.balance;
                }
            } else {
                console.error('Invalid response structure:', data);
            }
        })
        .catch(error => {
            console.error('Error handling balance:', error);
        });
});