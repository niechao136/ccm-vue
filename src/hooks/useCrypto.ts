import CryptoJS from 'crypto-js'

export const useCrypto = () => {
  const INIT_KEY = 'Adv#CCM_q54d'

  const getAesKey = (key: string) => {
    const Utf8Encode = new TextEncoder()
    const newArray = new Uint8Array(16)
    const keyArray = Utf8Encode.encode(key)
    for (let i = 0; i < newArray.length; i++) {
      newArray[i] = i >= keyArray.length ? 0 : keyArray[i]
    }
    // console.log(newArray.toString())
    return newArray
  }

  const key = CryptoJS.lib.WordArray.create(getAesKey(INIT_KEY) as any)
  //const key = CryptoJS.enc.Utf8.parse(getAesKey(INIT_KEY))

  const aesDecrypt = (encrypted: string) => {
    encrypted = encrypted.replace(" ", "")
    // 这里 mode, padding 一定要跟加密的时候完全一样
    // 返回的是一个解密后的对象
    const decrypt = CryptoJS.AES.decrypt(encrypted, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    // 将解密对象转换成 UTF8 的字符串
    //console.log(decrypt, key)
    return CryptoJS.enc.Utf8.stringify(decrypt)
  }

  const aesEncrypt = (encrypt: string) => {
    const encrypted = CryptoJS.AES.encrypt(encrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    //console.log(encrypted.ciphertext)
    return encrypted.toString()
    //return CryptoJS.enc.Utf8.stringify(encrypted.ciphertext)
  }

  return {
    aesDecrypt,
    aesEncrypt
  }
}
