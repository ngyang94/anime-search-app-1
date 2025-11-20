
export function addZeroPrefixToSingleNumber(number:number):string{
    return (number>0&&number<=9?"0"+number:number.toString());
}