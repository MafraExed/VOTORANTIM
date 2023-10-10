function loadPDF()
{
	var loadXML = new XMLHttpRequest();
	
	//Load the XDP		
	loadXML.open("GET", "base64.bin", false);
	loadXML.setRequestHeader("Content-Type", "text/xml");
	loadXML.send(null);
	
	var loadedPDF = loadXML.responseText;
	
	return loadedPDF;
}