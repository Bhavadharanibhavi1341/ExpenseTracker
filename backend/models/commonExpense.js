const mongoose=require('mongoose')

const commonExpenseSchema =new mongoose.Schema({
    commonExpense:{
        type:[String],
        required:true,
        minlength:1,
        trim:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user']
    }
})

module.exports=mongoose.model("commonExpense",commonExpenseSchema)
