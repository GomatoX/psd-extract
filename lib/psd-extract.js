'use babel';

import PsdExtractView from './psd-extract-view';
import { CompositeDisposable } from 'atom';

export default {

	PsdExtractViewMain: null,
	psdExtractView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		
		this.psdExtractView = new PsdExtractView(state.psdExtractViewState);
		
		this.modalPanel = atom.workspace.addRightPanel({
			item: this.psdExtractView.getElement(),
			visible: true,
			flexScale: 2,
		});

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'psd-extract:toggle': () => this.toggle()
		}));
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.psdExtractView.destroy();
	},

	serialize() {
		return {
			psdExtractViewState: this.psdExtractView.serialize()
		};
	},

	toggle() {
		console.log('PsdExtract was toggled!');
		
		return (
			this.modalPanel.isVisible() ?
			this.modalPanel.hide() :
			this.modalPanel.show()
		);
	}

};
