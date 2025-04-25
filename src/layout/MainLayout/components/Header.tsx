import { shortenAddr } from "../../../lib/utils";
import { contractAddr } from "../../../contracts/contractData";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Button from "../../../components/Button";

const Header = () => {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  return (
    <header className="py-3 border-b">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Crowdfunding</h1>
          <a
            href={`https://sepolia.etherscan.io/address/${contractAddr}`}
            target="_blank"
            className="flex items-center gap-1 p-1 text-sm rounded-lg hover:bg-gray-200"
            rel="noopener noreferrer"
          >
            {shortenAddr(contractAddr)}
          </a>
        </div>
        <Button onClick={() => open()}>
          {isConnected ? shortenAddr(contractAddr) : "Connect Wallet"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
