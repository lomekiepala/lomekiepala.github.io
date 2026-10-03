function reducePrecision(val,precision){
	let ratio = (10**precision)
	return Math.round(val*ratio)/ratio
	// ratio := math.Pow(10, float64(precision))
	// return math.Round(val*ratio) / ratio
}
function getCopyBtn(toCopy,btnContent){
	return `<span class="sharebtn" onclick="navigator.clipboard.writeText('${toCopy}');showPopup()">${btnContent}</span> <br>`
}
export{getCopyBtn,reducePrecision}

