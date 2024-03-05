async function depositMoney() {
    let amountElement = document.getElementById('amount') as HTMLInputElement;
    let amount = amountElement.value;

    let accountElement = document.getElementById('accountID') as HTMLInputElement;
    let account = accountElement.value;

    await fetch('/db/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "account": account, "amount": amount })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.updatedBank && data.updatedBank.balance !== undefined) {
                let bankBalanceElement = document.getElementById('bank-balance') as HTMLElement;
                if (bankBalanceElement) {
                    bankBalanceElement.innerText = data.updatedBank.balance + ' USD';
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

    let accountElement = document.getElementById('accountID') as HTMLInputElement;
    let account = accountElement.value;

    await fetch('/db/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "account": account, "amount": amount })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.updatedBank && data.updatedBank.balance !== undefined) {
                let bankBalanceElement = document.getElementById('bank-balance') as HTMLElement;
                if (bankBalanceElement) {
                    bankBalanceElement.innerText = data.updatedBank.balance + ' USD';
                }
            } else {
                console.error('Invalid response structure:', data);
            }
        })
        .catch(error => {
            console.error('Error handling withdraw:', error);
        });
}