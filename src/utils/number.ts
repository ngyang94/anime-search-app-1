
export function addZeroPrefixToSingleNumber(number:number){
    return (number>0&&number<=9?"0"+number:number);
}