import React, { useState } from "react";
import Card from "./Card";
import { useAppKit, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, parseEther } from "ethers";
import { Contract } from "ethers";
import { contractABI, contractAddr } from "../contracts/contractData";
import Button from "./Button";
import { TransactionResponse } from "ethers";
import { LoaderCircle } from "lucide-react";
import { shortenAddr } from "../lib/utils";

interface FundCartProps {
  fetchContractData: () => void;
}

const FundCard = ({ fetchContractData }: FundCartProps) => {
  const [amountFund, setAmountFund] = useState<number | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [txHash, settxHash] = useState<string | null>(null);
  const { walletProvider } = useAppKitProvider("eip155");
  const { open } = useAppKit();

  const handleFundToCrowdfunding = async () => {
    setisLoading(true);

    try {
      if (amountFund === null || amountFund <= 0) {
        alert("Amount Funding Invalid");
        return;
      }
      if (walletProvider) {
        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(contractAddr, contractABI, signer);

        const tx: TransactionResponse = await contract.fund({
          value: parseEther(String(amountFund)),
        });

        settxHash(tx.hash);

        await tx.wait();
        fetchContractData();
      } else {
        open();
      }
    } catch (error) {
      alert("Fund to crowfunding Error");
    } finally {
      setisLoading(false);
    }
  };

  function onInputAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmountFund(e.target.value);
  }
  return (
    <Card className="w-[70%] py-8 px-4 space-y-2">
      {!isLoading && (
        <>
          <h2 className="text-lg font-semibold">Donate your Ether</h2>
          <div className="space-x-2">
            <input
              placeholder="amount"
              className="p-2 text-sm border rounded-lg"
              type="number"
              onChange={onInputAmountChange}
            />

            <Button onClick={handleFundToCrowdfunding}>Donate</Button>
          </div>
        </>
      )}

      {isLoading && (
        <>
          <div className="flex items-center gap-2">
            <LoaderCircle className="animate-spin" />
            <span>Transaction is Pending ...</span>
          </div>
          {txHash && (
            <>
              <span>Transaction: </span>
              <a
                target="_blank"
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                className="cursor-pointer hover:underline"
              >
                {shortenAddr(txHash)}
              </a>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default FundCard;
