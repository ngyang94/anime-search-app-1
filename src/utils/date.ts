import {addZeroPrefixToSingleNumber} from './number';

export function formatDate(date:Date){
    return addZeroPrefixToSingleNumber(date.getDate())+"/"+addZeroPrefixToSingleNumber(date.getMonth()+1)+"/"+date.getFullYear()
}