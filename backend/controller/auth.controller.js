import bcrypt from 'bcryptjs'
import {generateToken} from '../utils/generateToken.js'
import {User} from '../models/User.model.js'

export const signup = async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({success:false, message: 'All the fields are required'})
        }

        const userAlreadyExist = await User.findOne({email}) 
        if (userAlreadyExist) {
            return res.status(400).send({success: false, message: 'User already Exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User ({
            firstName, 
            lastName,
            email, 
            password: hashedPassword
        })
        await user.save()
        res.status(201).send({success: true, message: 'User created successfully', 
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false, message: 'Something went wrong. User can not created'})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        if (!email || !password) {
            return res.status(400).send({success: false, message: 'Both email and password are required'})
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).send({success: false, message: 'User not found'})
        } 
        const checkPass = await bcrypt.compare(password, user.password)
        if (!checkPass) {
            return res.status(401).send({success: false, message: 'Invalid Password'})
        }

        //generate token
        const token = generateToken(user._id)

        //store token in cookies
        res.cookie('token', token, {
            httpOnly: true,        //prevents JS access (more secure)
            secure: process.env.NODE_ENV === 'production',    //sends only over HTTPS in prod
            sameSite: 'strict',     //protect from CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000  //7days
        })

        res.status(200).send({
            success: true,
            message: 'login Successful',
            token,
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log('Something is wrong, please try again', error.message);
        return res.status(500).send({success: false, message: 'Something wnet wrong'})
    }
}

export const logout = async(req, res) => {
    res.clearCookie('token')
    res.status(200).send({success: true, message: 'Logout Successful!'})
}