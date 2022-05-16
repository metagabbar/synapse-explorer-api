import {Decimal128} from "mongodb";

export class BridgeTransaction {
    constructor(args) {

        this.addressFrom = args.fromAddress;
        this.addressTo = args.toAddress;
        this.txnFromHash = args.fromTxnHash;
        this.txnToHash = args.toTxnHash;
        this.chainIdTo = args.toChainId;
        this.chainIdFrom = args.fromChainId;
        this.sentValue = args.sentValue;
        this.receivedValue = args.receivedValue;
        this.sentTokenAddress = args.sentTokenAddress;
        this.sentTokenSymbol = args.sentTokenSymbol;
        this.receivedTokenAddress = args.receivedTokenAddress;
        this.receivedTokenSymbol = args.receivedTokenSymbol;
        this.sentTime = args.sentTime;
        this.receivedTime = args.receivedTime;
        this.kappa = args.kappa;
        this.pending = args.pending;
        this.swapSuccess = args.swapSuccess;
    }
}