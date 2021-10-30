import {
  Component
} from '@angular/core';

import { MathContent } from 'src/app/math/math-content.js';

import * as ClassicEditor from '../../../assets/js/ck-editor-math-type/ckeditor.js';

@Component({
  selector: 'app-competitors',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.scss'],
})
export class CompetitorsComponent {
 title = 'ckeditorwithMath';
  data ='';
  editorData = '';
  public Editor = ClassicEditor;
    
    public model = {
        editorData: '<p>Hello, world!</p>'
    };
    mathMl: MathContent = {
      /**change this code */
      mathml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mover>
        <munder>
          <mo>∫</mo>
          <mn>0</mn>
        </munder>
        <mi>∞</mi>
      </mover>
      <mtext> versus </mtext>
      <munderover>
        <mo>∫</mo>
        <mn>0</mn>
        <mi>∞</mi>
      </munderover>
    </mrow>
  </math>
  
  <math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><msup><mn>4</mn><mn>2</mn></msup></msqrt><mo>&nbsp;</mo><mfenced><mtable><mtr><mtd><mn>5</mn></mtd></mtr><mtr><mtd><mn>9</mn></mtd></mtr></mtable></mfenced><mo>&nbsp;</mo><mstyle displaystyle="false"><munderover><mo>∑</mo><mn>5</mn><mn>9</mn></munderover></mstyle></math>
  <math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mfenced close="]" open="["><mi>x</mi></mfenced><mn>4</mn></msup></math></p>
  `
    };

    showval()
    {
      console.log(this.model.editorData);
      this.data = this.model.editorData;
      this.editorData = this.data;
      this.mathMl.mathml = this.data;

    }
}

