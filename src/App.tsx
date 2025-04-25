import { createAppKit, useAppKitProvider } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { arbitrum, sepolia } from "@reown/appkit/networks";
import { contractABI, contractAddr } from "./contracts/contractData";
import { BrowserProvider, Contract, formatEther } from "ethers";
import { useEffect, useState } from "react";
import { MainLayout } from "./layout/MainLayout";
import Card from "./components/Card";
import FundCard from "./components/FundCard";
import { LoaderCircle } from "lucide-react";
import { FundedEvent } from "./lib/type";
import { shortenAddr } from "./lib/utils";
import { InfuraProvider } from "ethers";

// 1. Get projectId
const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

// 2. Set the networks
const networks = [arbitrum, sepolia];

// 3. Create a metadata object - optional
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [sepolia],
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export default function App() {
  const { walletProvider } = useAppKitProvider("eip155");
  const [crowdfundingBal, setcrowdfundingBal] = useState<string | null>(null);
  const [FunderLength, setFunderLength] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [historyEvents, sethistoryEvents] = useState<FundedEvent[] | null>(
    null
  );

  const fetchContractData = async () => {
    setisLoading(true);
    try {
      let ethersProvider;

      if (walletProvider) {
        ethersProvider = new BrowserProvider(walletProvider);
      } else {
        ethersProvider = new InfuraProvider(
          "sepolia",
          import.meta.env.INFURA_SEPOLIA_KEY
        );
      }
      const contract = new Contract(contractAddr, contractABI, ethersProvider);
      const contractBalance = await ethersProvider.getBalance(contractAddr);
      setcrowdfundingBal(formatEther(contractBalance));
      const responseFundersLength = await contract.getFundersLength();
      setFunderLength(responseFundersLength);
      const fundedFilter = contract.filters.Funded;
      const fundedEvents = await contract.queryFilter(fundedFilter, 1000);
      const fundedEventFormated: FundedEvent[] = [];

      for (let i = 0; i < fundedEvents.length; i++) {
        const currenEvent = fundedEvents[i];

        const eventObj: FundedEvent = {
          blockNumber: currenEvent.blockNumber,
          txHash: currenEvent.transactionHash,
          funder: (currenEvent as any).args[0],
          value: formatEther((currenEvent as any).args[1]),
        };

        fundedEventFormated.push(eventObj);
        sethistoryEvents(fundedEventFormated);
      }

      fundedEventFormated.sort((a, b) => b.blockNumber - a.blockNumber);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [walletProvider]);

  return (
    <MainLayout>
      <div className="flex items-center justify-start">
        <div className="space-y-2 w-[30%]">
          <Card>
            <h2 className="text-lg font-semibold">Total Amount Funding</h2>
            {isLoading && <LoaderCircle className="animate-spin" />}
            {!isLoading && crowdfundingBal && (
              <p className="text-xl font-bold">
                {crowdfundingBal}
                <span className="text-base">ETH</span>
              </p>
            )}
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Funders</h2>
            {isLoading && <LoaderCircle className="animate-spin" />}
            {!isLoading && crowdfundingBal && (
              <p className="text-xl font-bold">{FunderLength}</p>
            )}
          </Card>
        </div>
        <FundCard fetchContractData={fetchContractData} />
      </div>
      <div className="mt-6 , pt-6 border-t space-y-2">
        {isLoading && <LoaderCircle className="animate-spin" />}
        {!isLoading && (
          <>
            <h2 className="text-lg font-semibold">Laytest Donation</h2>
            {historyEvents?.length !== 0 &&
              historyEvents?.map((item) => (
                <Card
                  key={item.txHash}
                  className="flex justify-between gap-2 text-center shadow-none"
                >
                  <div>
                    <p className="text-sm font-semibold">Funder</p>
                    <a
                      target="_blank"
                      href={`https://sepolia.etherscan.io/address/${item.funder}`}
                    >
                      {shortenAddr(item.funder)}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Value</p>
                    <p>{item.value}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Txhash</p>
                    <a
                      target="_blank"
                      href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                    >
                      {shortenAddr(item.txHash)}
                    </a>
                  </div>
                </Card>
              ))}
          </>
        )}
      </div>
    </MainLayout>
  );
}
