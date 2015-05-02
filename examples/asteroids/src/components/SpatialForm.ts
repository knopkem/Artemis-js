/// <reference path="../../../../src/Component.ts" />

class SpatialForm extends Component {
	
	private _spatialFormFile: string;
	
	constructor(filename: string) {
		super();
		this._spatialFormFile = filename;
	}
	
	public getSpatialFormFile() : string {
		return this._spatialFormFile;
	}
}