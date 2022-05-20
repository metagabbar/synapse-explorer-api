import {getNetworkNameFromId, getTokenSymbolFromAddress} from "../utils/sdkUtils.js";
import {ChainId, Networks} from "@synapseprotocol/sdk";

export class BridgeTransaction {
    constructor(args) {
        this.addressFrom = args.fromAddress ? args.fromAddress.trim() : args.fromAddress;
        this.addressTo = args.toAddress ? args.toAddress.trim() : args.toAddress;
        this.txnFromHash = args.fromTxnHash ? args.fromTxnHash.trim() : args.fromTxnHash;
        this.txnToHash = args.toTxnHash ? args.toTxnHash.trim() : args.toTxnHash;
        this.chainIdTo = args.toChainId;
        this.chainIdFrom = args.fromChainId;
        this.sentValue = args.sentValue;
        this.receivedValue = args.receivedValue;
        this.sentTokenAddress = args.sentTokenAddress ? args.sentTokenAddress.trim() : args.sentTokenAddress;
        this.receivedTokenAddress = args.receivedTokenAddress ? args.receivedTokenAddress.trim() : args.receivedTokenAddress;
        this.sentTime = args.sentTime;
        this.receivedTime = args.receivedTime;
        this.kappa = args.kappa ? args.kappa.trim() : args.kappa;
        this.pending = args.pending;
        this.swapSuccess = args.swapSuccess;
    }

    sentTokenSymbol() {
        if (!this.chainIdFrom || !this.sentTokenAddress) {
            return
        }
        return getTokenSymbolFromAddress(this.chainIdFrom, this.sentTokenAddress)
    }

    receivedTokenSymbol() {
        if (!this.chainIdTo || !this.receivedTokenAddress) {
            return
        }
        return getTokenSymbolFromAddress(this.chainIdTo, this.receivedTokenAddress)
    }
}