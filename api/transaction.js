export class Transaction {
    constructor(args) {
        this.addressFrom = args.addressFrom ? args.addressFrom : null;
        this.txnFromHash = args.txnFromHash ? args.txnFromHash : null;

        this.chainIdTo = args.chainIdTo ? args.chainIdTo : null;
        this.addressTo = args.addressTo ? args.addressTo : null;
        this.txnToHash = args.txnToHash ? args.txnToHash : null;

        this.sentValue = args.sentValue ? args.sentValue : null;
        this.sentValueUSD = args.sentValueUSD ? args.sentValueUSD : null;
        this.sentTokenAddress = args.sentTokenAddress ? args.sentTokenAddress : null;
        this.sentTokenSymbol = args.sentTokenSymbol ? args.sentTokenSymbol : null;
        this.sentTime = args.sentTime ? args.sentTime : null;

        this.receivedValue = args.receivedValue ? args.receivedValue : null;
        this.receivedValueUSD = args.receivedValueUSD ? args.receivedValueUSD : null;
        this.receivedTokenAddress = args.receivedTokenAddress ? args.receivedTokenAddress : null;
        this.receivedTokenSymbol = args.receivedTokenSymbol ? args.receivedTokenSymbol : null;
        this.receivedTime = args.receivedTime ? args.receivedTime : null;

        this.kappa = args.kappa ? args.kappa : null;
        this.pending = args.pending ? args.pending : null;
        this.swapSuccess = args.swapSuccess ? args.swapSuccess : null;

    }
}