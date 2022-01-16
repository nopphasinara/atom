console.clear();

import axios from 'axios';

async function asyncwaitcode(){
  let getData = await axios('www.xyzdata.org/api');
  console.log(getData.data)
}

asyncwaitcode();