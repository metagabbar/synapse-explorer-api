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
        this.sentTokenAddress = args.sentTokenAddress;
        this.sentTokenSymbol = args.sentTokenSymbol;
        this.sentTime = args.sentTime;
        this.receivedTokenAddress = args.receivedTokenAddress;
        this.receivedTokenSymbol = args.receivedTokenSymbol;
        this.receivedTime = args.receivedTime;
        this.kappa = args.kappa;
        this.pending = args.pending;
        this.swapSuccess = args.swapSuccess;

        this.sentValueUSD = args.sentValueFormatted ? Decimal128(args.sent_value_formatted.toString()).toString() : null;
        this.receivedValueUSD = args.sentValueFormatted ? Decimal128(args.received_value_formatted.toString()).toString() : null;
    }
}