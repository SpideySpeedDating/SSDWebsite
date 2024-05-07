import {DomBuilder} from "./parser/dom-builder";



// class App {
//     private outputDir: string;
//     private inputDir: string;

//     constructor() {
//         for (let arg of process.argv) {
            
//         }
//     }
// }


new DomBuilder(`
<!DOCTYPE html>
<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Document</title>
		</head>
		<!--Comment Nyana wabo-->
		<body>
                <div><div>
				<section id="app-container">
					Default Text
				</section>
				<script src="index.js" type="module">
					Console.log("Hello World");
				</script>
                <style>
                    div {
                        color: blue;
                    }
                </style>
		</body>
</html>
`, "document.html").build();
