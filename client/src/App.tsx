import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel';
// import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {ethers} from 'ethers';
// import {Cancel} from "@mui/icons-material"
import artifact from './artifacts/contracts/Crowdsale.sol/Crowdsale.json'
import genericErc20Abi from './artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
const CONTRACT_ADDRESS = "0x40e16bD52d9C6c478ddF3145499a23cD92699351"
const TOKEN_ADDRESS = "0x45Ce27a00b70617Ef0f3BF0cc56cbf4f289e076c"
const API_KEY = "Asjr3b9_dLUHw_k40nW9jPfDejcOnYD_"


function App() {
 const [provider, setProvider] = useState<ethers.providers.AlchemyProvider | undefined>(undefined);
 const [provider2, setProvider2] = useState<ethers.providers.Web3Provider | undefined>(undefined);
 const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined);
 const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
 const [tokenContract, setTokenContract] = useState<ethers.Contract | undefined>(undefined);
 const [signerAddress, setSignerAddress] = useState<string | undefined>(undefined)
 const [amount, setAmount] = useState(0)
 const [rate, setRate] = useState(0)
 const [balance, setBalance] = useState(0)
 const [totalSupply, setTotalSupply] = useState(0)
 const [loadingSigner, setLoadingSigner] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  // const [nonce, setNonce] = React.useState(0)

 useEffect(() => {
  const onLoad = async () => {
    const provider: ethers.providers.AlchemyProvider = await new ethers.providers.AlchemyProvider("goerli", API_KEY);
    setProvider(provider);

    const provider2: ethers.providers.Web3Provider = await new ethers.providers.Web3Provider(window.ethereum!);
    setProvider2(provider2);


    const contract = await new ethers.Contract(
      CONTRACT_ADDRESS,
      artifact.abi,
      provider
    )
    // console.log("contract: ", contract)
    setContract(contract)

    let rate = await contract.rate();
    rate = parseFloat(ethers.utils.formatUnits(rate, 0))
    setRate(rate)
      

    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, genericErc20Abi.abi, provider)
    // console.log("tokenContract: ", tokenContract)
    setTokenContract(tokenContract)

    let totalSupply = await tokenContract.totalSupply()
    totalSupply = parseFloat(ethers.utils.formatEther(totalSupply))
    setTotalSupply(totalSupply)
    
  }
  if(!window.ethereum) {
    return
  } else {
    onLoad()
  }
    
 }, [])



 

 const isConnected = () => (signer !== undefined)

 const getBalance = async (_address :string) => {
  let balance = await tokenContract!.balanceOf(_address)
  balance = parseFloat(ethers.utils.formatEther(balance))
  
  return balance
 }

 const getSignerFunc = async (provider : ethers.providers.Web3Provider) => {
  provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()

  console.log("signer: ", signer)

  signer.getAddress()
    .then(address => {
      setSignerAddress(address)
      getBalance(address).then(balance => {
        setBalance(balance)
      })
    })
   
  return signer
 }

 

 const connectWallet = async () => {
    setLoadingSigner(true)
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    console.log("provider: ", provider)

    getSignerFunc(provider2!).then(signer => {
      setSigner(signer)
    })

  
    setLoadingSigner(false)
    
 }

 const toWei = (ether: string) => ethers.utils.parseEther(ether)

 const buyTokens = async () => {
  if (amount === 0) return;
  const wei = toWei(`${amount}`);


  await contract!.connect(signer!).buyTokens(signerAddress, {value: wei, gasLimit: 5000000})
    .then(async (response: any ) => {
      console.log("response: ", response)
      await response.wait()
        .then((data: any )=> console.log(data))
    })
    .catch((err: any) => {
      console.log("err: ", err)
      setHasError(true)
      setErrorMessage(err.message)
    });

  

  

  setAmount(0);
 }



 const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement;

  // console.log(target.value)
  setHasError(false)
      setErrorMessage("")
  setAmount(Number(target.value));
 }

 

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
          Welcome to PIN Token Crowdsale
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
          Token Address: {TOKEN_ADDRESS}
            </Typography>

            <Typography variant="body2" component="p" gutterBottom>
          Total Supply: {totalSupply}
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
          Rate: {rate}
            </Typography>
          {isConnected() ? <Box>
          
            {!loadingSigner && <>
              <Typography variant="body2" component="p" gutterBottom>
          Address: {signerAddress}
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
          You have {balance} PIN Coin
            </Typography>
            </>}
            {loadingSigner && <Typography variant="body2" component="p" gutterBottom>
          Loading Account
            </Typography>
            }
            <Button onClick={connectWallet}>
            Refresh Wallet Data
          </Button>
          </Box> : <Box>
          <Typography variant="body1" component="h1" gutterBottom>
            You are not connected
            </Typography>
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
          </Box> }
        
        
      <Box sx={{ my: 4 }} component="form" >
        
        <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          Eth Amount
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          type="number"
          inputProps={{min: 0, }}
          value={amount}
          error={hasError}
          onChange={handleAmountChange}
          // startAdornment={
          //   <InputAdornment position="end">
          //     Eth
          //   </InputAdornment>
          // }
        />
        <FormHelperText>{hasError ? errorMessage : `1 Eth = ${rate} PIN`}</FormHelperText>
      </FormControl>
         <Grid container >
         <Button disabled={!isConnected()} onClick={buyTokens} sx={{ my: 2}}>
            Buy
          </Button>
         </Grid>
          
         {(isConnected() && amount > 0) && <Typography variant="body1" component="h1" gutterBottom>
            You will receive &#8776; {(rate * amount).toFixed(18)} PIN
            </Typography>}
      </Box>

      <Box component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://preciousnwaoha.github.io/">
        My Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
      </Box>
    </Container>
  );
}

export default App;
