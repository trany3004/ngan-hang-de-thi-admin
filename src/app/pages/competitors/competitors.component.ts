import { Component } from "@angular/core";
import { MonHocService } from "src/app/services/monhoc.service";
import { MathContent } from "src/app/math/math-content.js";
import { OutletService } from "src/app/services/outlet.service";
import { KhoiHocService } from "src/app/services/khoihoc.service";
import { ChuongService } from "src/app/services/chuong.service";
import * as ClassicEditor from "../../../assets/js/ck-editor-math-type/ckeditor.js";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-competitors",
  templateUrl: "./competitors.component.html",
  styleUrls: ["./competitors.component.scss"],
})
export class CompetitorsComponent {
  title = "ckeditorwithMath";
  data = "";
  editorData = "";
  imageUpdated: any = {};
  selectedFile: File = null;

  formGroup: FormGroup;
  regions: any[] = [];
  cities: any[] = [];
  groups: any[] = [];
  // title: string = '';
  monHocList$: Observable<any[]>;
  khoiHocList$: Observable<any[]>;
  chuongList$: Observable<any[]>;

  mode = "create";

  id;

  loading = false;
  noidung = "";

  public Editor = ClassicEditor;

  public model = {
    editorData: "",
  };
  //   mathMl: MathContent = {
  //     /**change this code */
  //     mathml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
  //   <mrow>
  //     <mover>
  //       <munder>
  //         <mo>∫</mo>
  //         <mn>0</mn>
  //       </munder>
  //       <mi>∞</mi>
  //     </mover>
  //     <mtext> versus </mtext>
  //     <munderover>
  //       <mo>∫</mo>
  //       <mn>0</mn>
  //       <mi>∞</mi>
  //     </munderover>
  //   </mrow>
  // </math>

  // <math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><msup><mn>4</mn><mn>2</mn></msup></msqrt><mo>&nbsp;</mo><mfenced><mtable><mtr><mtd><mn>5</mn></mtd></mtr><mtr><mtd><mn>9</mn></mtd></mtr></mtable></mfenced><mo>&nbsp;</mo><mstyle displaystyle="false"><munderover><mo>∑</mo><mn>5</mn><mn>9</mn></munderover></mstyle></math>
  // <math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mfenced close="]" open="["><mi>x</mi></mfenced><mn>4</mn></msup></math></p>
  // `
  //   };

  showval() {
    console.log(this.model.editorData);
    // this.data = this.formGroup.get("noidung").value;
    console.log("DDDDĐ", this.data);
    this.editorData = this.data;
    // this.mathMl.mathml = this.data;
  }

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private monHocService: MonHocService,
    private chuongHocService: ChuongService,
    private khoiService: KhoiHocService,
    private router: ActivatedRoute
  ) {
    this.formGroup = this.fb.group({
      ten: [null, Validators.required],
      monhoc: [null, Validators.required],
      noidung: ['', Validators.required],
      chuong: [null, Validators.required],
      khoihoc: [null, Validators.required],
    });
  }
  ngOnInit() {
    const id = this.router.snapshot.paramMap.get("id");
    this.mode = id ? "update" : "create";
    this.id = id;
    this.init();
  }

  init() {
    this.monHocList$ = this.monHocService.get();
    this.chuongList$ = this.chuongHocService.get();
    this.khoiHocList$ = this.khoiService.get();

    if (this.mode === "update") {
      this.loading = true;
      this.outletService.getChuDeById(this.id).subscribe((dataUpdated) => {
        if (dataUpdated && dataUpdated.length > 0) {
          dataUpdated = dataUpdated[0];
          this.formGroup.controls["ten"].setValue(dataUpdated.ten);
          this.formGroup.controls["monhoc"].setValue(dataUpdated.monhoc._id);
          this.formGroup.controls["khoihoc"].setValue(dataUpdated.khoihoc._id);
          this.formGroup.controls["chuong"].setValue(dataUpdated.chuong._id);
          this.formGroup.controls['noidung'].setValue(dataUpdated.noidung || '');
        }
      });
    }
  }

  save() {
    if (this.formGroup.valid) {
      this.loading = true;
      const value = { ...this.formGroup.value};
      if (this.mode === "create") {
        this.outletService.createChuDe(value, this.imageUpdated, this.selectedFile?.name).subscribe(
          (res) => {
            this.loading = false;
          },
          (_) => (this.loading = false)
        );
      }
      if (this.mode === "update") {
        if (this.selectedFile) {
          value.file = this.imageUpdated;
          value.fileName = this.selectedFile.name
        }
        this.outletService.update(this.id, value).subscribe(
          (res) => {
            this.loading = false;
            // this.dialogRef.close(res);
          },
          (_) => (this.loading = false)
        );
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  onFileSelected(event, type) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.size <= 1000000) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
          const that = this;
            reader.onload = function (e: any) {
              that.imageUpdated = e.target.result;
            };
            reader.readAsDataURL(this.selectedFile);
            // this.uploadMediaService.upload(this.selectedFile).subscribe(res => {
            //   if (res && res.length) {
            //     this.imageUpdated = res[0];
            //   }
            //   },
            //   errors => {
            //       console.error(errors);
            //   }
            // );
        }
    } else {
    }
  }

  deleteImage() {
    this.imageUpdated = null
  }
}
