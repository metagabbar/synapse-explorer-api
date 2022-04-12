import {Decimal128} from "mongodb";

export class Transaction {
    constructor(args) {

        this.addressFrom = args.from_address;
        this.txnFromHash = args.from_tx_hash;
        this.chainIdTo = args.to_chain_id;
        this.addressTo = args.to_address;
        this.txnToHash = args.to_tx_hash;
        this.sentValue = args.sent_value;
        this.sentValueUSD = args.sent_value_formatted ? Decimal128(args.sent_value_formatted.toString()).toString() : null;
        this.sentTokenAddress = args.sent_token;
        this.sentTokenSymbol = args.sent_token_symbol;
        this.sentTime = args.sent_time;
        this.receivedValue = args.received_value;
        this.receivedValueUSD = args.received_value_formatted ? Decimal128(args.received_value_formatted.toString()).toString() : null;
        this.receivedTokenAddress = args.received_token;
        this.receivedTokenSymbol = args.received_token_symbol;
        this.receivedTime = args.received_time;
        this.kappa = args.kappa;
        this.pending = args.pending;
        this.swapSuccess = args.swap_success;
    }
}