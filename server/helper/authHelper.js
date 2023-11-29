import bcrypt from 'bcrypt'

export const hashPassword = async (password)=>{
    try{
        const saltRounds = 10
        const hashPassword = await bcrypt.hash(password, saltRounds)
        return hashPassword
    }catch(err){
        console.log(err);
    }
}

export const comparePassword = (password, hashPassword)=>{
    return bcrypt.compare(password, hashPassword)
}