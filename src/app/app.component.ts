import { Component, OnInit } from "@angular/core";
import {
  KnoraApiConfig,
  KnoraApiConnection,
  ReadResource,
  ReadResourceSequence,
  ApiResponseError,
} from "@dasch-swiss/dsp-js";
import { environment } from "../environments/environment";

@Component({
  selector: "gr-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "GettingRepresentations";

  query = "query";
  knoraApiConnection: KnoraApiConnection;
  searchResult: ReadResource[];

  getRepresentations() {
    const gravsearchQueryRepresentations = `
      PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
      PREFIX theatre-societe: <${environment.knoraApiProtocol}://${environment.knoraApiHost}/ontology/0103/theatre-societe/v2#>
      CONSTRUCT {
        ?mainRes knora-api:isMainResource true .
      } WHERE {
        ?mainRes a knora-api:Resource .
        ?mainRes a theatre-societe:Representation .
      }
      OFFSET 0
    `;
    this.query = gravsearchQueryRepresentations;
    console.log("gravsearchQuery: " + this.query);
    this.knoraApiConnection.v2.search.doExtendedSearch(this.query).subscribe(
      (res: ReadResourceSequence) => {
        console.log(res);
        this.searchResult = res.resources;
      },
      (error: ApiResponseError) => console.log("do I catch it?")
    );
  }

  ngOnInit() {
    const config = new KnoraApiConfig(
      environment.knoraApiProtocol as "http" | "https",
      environment.knoraApiHost,
      environment.knoraApiPort,
      undefined,
      undefined,
      true
    );
    this.knoraApiConnection = new KnoraApiConnection(config);
    console.log("config: ");
    console.log(this.knoraApiConnection);
    this.getRepresentations();
  }
}
