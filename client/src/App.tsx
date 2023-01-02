import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {ethers} from 'ethers';
import {Cancel} from "@mui/icons-material"
import artifact from './artifacts/contracts/Crowdsale.sol/Crowdsale.json'
const CONTRACT_ADDRESS = "lkjfk0"

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const NotConnected = () => {
  return (
    <Box>Not Connected</Box>
  )
}

function App() {
 const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
 const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined);
 const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
 const [signerAddress, setSignerAddress] = useState<string | undefined>(undefined)
 const [amount, setAmount] = useState(0)
 const [loading, setLoading] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

 useEffect(() => {

  if(!window.ethereum) return

  const onLoad = async () => {
    const provider: ethers.providers.Web3Provider = await new ethers.providers.Web3Provider(window.ethereum!);
    setProvider(provider);

    const contract = await new ethers.Contract(
      CONTRACT_ADDRESS,
      artifact.abi
    )

    setContract(contract)
  }
    onLoad()
 })

 const isConnected = () => (signer !== undefined)


 const getSigner = async (provider : ethers.providers.Web3Provider) => {
  const signer = provider.getSigner()

  signer.getAddress().then(address => {
    setSignerAddress(address)
  })

  return signer
 }

 const connect = () => {

  if(!window.ethereum) return

  getSigner(provider!).then(signer => {
    setSigner(signer)
  })
 }

 const toWei = (ether: string) => ethers.utils.parseEther(ether)

 const buyTokens = async () => {
  const wei = toWei(`${amount}`);
  await contract!.connect(signer!).buyTokens(signerAddress, {value: wei});

  setAmount(0);
 }


 const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement;
  setAmount(target.value as number);
 }

 

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isConnected() ? "Create React App example with TypeScript" : "not connected"}
        </Typography>
        <Input type="number" onChange={handleAmountChange} />
        <TextField
            label="Enter invite code (e.g. ABC123)"
            value={amount}
            type={"number"}
            onChange={handleAmountChange}
            sx={{
              width: "70%",
            }}
            inputProps={{
              type: "number"
            }}
            error={hasError}
          />

          <Button onClick={() => buyTokens()}>
            Buy
          </Button>
        <Copyright />
      </Box>
    </Container>
  );
}

export default App;
