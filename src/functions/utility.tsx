// Parse raw text data and replace markers with HTML tags 
export const parseText = (text: string) => {

  // Create a regex to capture the tags and text inbetween
  const regex = /([^<]+)|(<i>)(.*?)(<\/i>)|(<b>)(.*?)(<\/b>)/g;

  const result = [];
  let match;

  // Loop through all matches in the text
  while((match = regex.exec(text)) !== null) {
  	const regularText = match[1];

  	const italicOpenTag = match[2];
  	const italicText = match[3];
  	const italicCloseTag = match[4];

  	const boldOpenTag = match[5];
  	const boldText = match[6];
  	const boldCloseTag = match[7];

  	// If no tags are found, just return the plain text
  	if(regularText) {
      result.push(regularText);
    }
    // If an <i> tag is found, wrap the content in <i>
    else if(italicOpenTag && italicCloseTag) {
      result.push(<i key={result.length}>{italicText}</i>);
    } 
    // If a <b> tag is found, wrap the content in <b>
    else if(boldOpenTag && boldCloseTag) {
      result.push(<b key={result.length}>{boldText}</b>);
    } 
  }

  // Return all content:
  return (
    <>
      <p>{result}</p>
    </>
  );
};