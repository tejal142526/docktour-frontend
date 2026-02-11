import { AfterViewInit, Component, Signal } from '@angular/core';
import { Breadcrumb } from '../../comman/breadcrumb/breadcrumb';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Wpapi } from '../../Services/Services/wpapi';
import Swal from 'sweetalert2';
import { NameOnlyDirective } from '../../directives/nameonly';
import { Phone } from '../../directives/phone';
import { Responsive } from '../../Services/responsive';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  flagUrl: string;
}

export interface ContactFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  organization: string;
  country: string;
  countryCode: string;
  message: string;
}

declare const AOS: any;
@Component({
  selector: 'app-contact-us',
  imports: [Breadcrumb, CommonModule, FormsModule, ReactiveFormsModule, NameOnlyDirective, Phone],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements AfterViewInit, ControlValueAccessor {
  selectedData: any;
  data: any = {};
  isMobile : any = false
  constructor(
    private fb: FormBuilder,
    private wpapi: Wpapi,
    private reponsiveService: Responsive,
  ) {
    this.isMobile = this.reponsiveService.isMobile;
  }

  contactForm!: FormGroup;

  ngAfterViewInit(): void {
    this.aosview();
  }

  formInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', Validators.required],
      country: ['', Validators.required],
      countryCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(4)]],
      organization: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.wpapi.submitContactForm(this.contactForm.value).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.contactForm.reset()
          this.contactForm.markAsUntouched()
          this.contactForm.markAsPristine()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Form submitted Successfully!!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error submitting form',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }

  ngOnInit(): void {
    this.getPageData();
    this.formInit();
    this.selectCountry({
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      dialCode: '+91',
      flagUrl: 'https://flagcdn.com/w40/in.png',
    });
  }
  aosview() {
    AOS.init({ duration: 1200, once: true });
    setTimeout(() => AOS.refresh(), 400);
  }
  openModal(data: any): void {
    console.log(data);
    this.selectedData = data;
  }

  getPageData() {
    this.wpapi.getPageDetailsBySlug('contact-us').subscribe({
      next: (value) => {
        if (value.length) {
          let Data = value || [];
          this.data = Data[0];
        }
      },
      error: (err) => console.error(err),
    });
  }
  countries: Country[] = [
    {
      code: 'AF',
      name: 'Afghanistan',
      flag: '🇦🇫',
      dialCode: '+93',
      flagUrl: 'https://flagcdn.com/w40/af.png',
    },
    {
      code: 'AL',
      name: 'Albania',
      flag: '🇦🇱',
      dialCode: '+355',
      flagUrl: 'https://flagcdn.com/w40/al.png',
    },
    {
      code: 'DZ',
      name: 'Algeria',
      flag: '🇩🇿',
      dialCode: '+213',
      flagUrl: 'https://flagcdn.com/w40/dz.png',
    },
    {
      code: 'AD',
      name: 'Andorra',
      flag: '🇦🇩',
      dialCode: '+376',
      flagUrl: 'https://flagcdn.com/w40/ad.png',
    },
    {
      code: 'AO',
      name: 'Angola',
      flag: '🇦🇴',
      dialCode: '+244',
      flagUrl: 'https://flagcdn.com/w40/ao.png',
    },
    {
      code: 'AG',
      name: 'Antigua and Barbuda',
      flag: '🇦🇬',
      dialCode: '+1-268',
      flagUrl: 'https://flagcdn.com/w40/ag.png',
    },
    {
      code: 'AR',
      name: 'Argentina',
      flag: '🇦🇷',
      dialCode: '+54',
      flagUrl: 'https://flagcdn.com/w40/ar.png',
    },
    {
      code: 'AM',
      name: 'Armenia',
      flag: '🇦🇲',
      dialCode: '+374',
      flagUrl: 'https://flagcdn.com/w40/am.png',
    },
    {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
      dialCode: '+61',
      flagUrl: 'https://flagcdn.com/w40/au.png',
    },
    {
      code: 'AT',
      name: 'Austria',
      flag: '🇦🇹',
      dialCode: '+43',
      flagUrl: 'https://flagcdn.com/w40/at.png',
    },
    {
      code: 'AZ',
      name: 'Azerbaijan',
      flag: '🇦🇿',
      dialCode: '+994',
      flagUrl: 'https://flagcdn.com/w40/az.png',
    },

    {
      code: 'BS',
      name: 'Bahamas',
      flag: '🇧🇸',
      dialCode: '+1-242',
      flagUrl: 'https://flagcdn.com/w40/bs.png',
    },
    {
      code: 'BH',
      name: 'Bahrain',
      flag: '🇧🇭',
      dialCode: '+973',
      flagUrl: 'https://flagcdn.com/w40/bh.png',
    },
    {
      code: 'BD',
      name: 'Bangladesh',
      flag: '🇧🇩',
      dialCode: '+880',
      flagUrl: 'https://flagcdn.com/w40/bd.png',
    },
    {
      code: 'BB',
      name: 'Barbados',
      flag: '🇧🇧',
      dialCode: '+1-246',
      flagUrl: 'https://flagcdn.com/w40/bb.png',
    },
    {
      code: 'BY',
      name: 'Belarus',
      flag: '🇧🇾',
      dialCode: '+375',
      flagUrl: 'https://flagcdn.com/w40/by.png',
    },
    {
      code: 'BE',
      name: 'Belgium',
      flag: '🇧🇪',
      dialCode: '+32',
      flagUrl: 'https://flagcdn.com/w40/be.png',
    },
    {
      code: 'BZ',
      name: 'Belize',
      flag: '🇧🇿',
      dialCode: '+501',
      flagUrl: 'https://flagcdn.com/w40/bz.png',
    },
    {
      code: 'BJ',
      name: 'Benin',
      flag: '🇧🇯',
      dialCode: '+229',
      flagUrl: 'https://flagcdn.com/w40/bj.png',
    },
    {
      code: 'BT',
      name: 'Bhutan',
      flag: '🇧🇹',
      dialCode: '+975',
      flagUrl: 'https://flagcdn.com/w40/bt.png',
    },
    {
      code: 'BO',
      name: 'Bolivia',
      flag: '🇧🇴',
      dialCode: '+591',
      flagUrl: 'https://flagcdn.com/w40/bo.png',
    },
    {
      code: 'BA',
      name: 'Bosnia and Herzegovina',
      flag: '🇧🇦',
      dialCode: '+387',
      flagUrl: 'https://flagcdn.com/w40/ba.png',
    },
    {
      code: 'BW',
      name: 'Botswana',
      flag: '🇧🇼',
      dialCode: '+267',
      flagUrl: 'https://flagcdn.com/w40/bw.png',
    },
    {
      code: 'BR',
      name: 'Brazil',
      flag: '🇧🇷',
      dialCode: '+55',
      flagUrl: 'https://flagcdn.com/w40/br.png',
    },
    {
      code: 'BN',
      name: 'Brunei',
      flag: '🇧🇳',
      dialCode: '+673',
      flagUrl: 'https://flagcdn.com/w40/bn.png',
    },
    {
      code: 'BG',
      name: 'Bulgaria',
      flag: '🇧🇬',
      dialCode: '+359',
      flagUrl: 'https://flagcdn.com/w40/bg.png',
    },
    {
      code: 'BF',
      name: 'Burkina Faso',
      flag: '🇧🇫',
      dialCode: '+226',
      flagUrl: 'https://flagcdn.com/w40/bf.png',
    },
    {
      code: 'BI',
      name: 'Burundi',
      flag: '🇧🇮',
      dialCode: '+257',
      flagUrl: 'https://flagcdn.com/w40/bi.png',
    },

    {
      code: 'KH',
      name: 'Cambodia',
      flag: '🇰🇭',
      dialCode: '+855',
      flagUrl: 'https://flagcdn.com/w40/kh.png',
    },
    {
      code: 'CM',
      name: 'Cameroon',
      flag: '🇨🇲',
      dialCode: '+237',
      flagUrl: 'https://flagcdn.com/w40/cm.png',
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      dialCode: '+1',
      flagUrl: 'https://flagcdn.com/w40/ca.png',
    },
    {
      code: 'CV',
      name: 'Cape Verde',
      flag: '🇨🇻',
      dialCode: '+238',
      flagUrl: 'https://flagcdn.com/w40/cv.png',
    },
    {
      code: 'CF',
      name: 'Central African Republic',
      flag: '🇨🇫',
      dialCode: '+236',
      flagUrl: 'https://flagcdn.com/w40/cf.png',
    },
    {
      code: 'TD',
      name: 'Chad',
      flag: '🇹🇩',
      dialCode: '+235',
      flagUrl: 'https://flagcdn.com/w40/td.png',
    },
    {
      code: 'CL',
      name: 'Chile',
      flag: '🇨🇱',
      dialCode: '+56',
      flagUrl: 'https://flagcdn.com/w40/cl.png',
    },
    {
      code: 'CN',
      name: 'China',
      flag: '🇨🇳',
      dialCode: '+86',
      flagUrl: 'https://flagcdn.com/w40/cn.png',
    },
    {
      code: 'CO',
      name: 'Colombia',
      flag: '🇨🇴',
      dialCode: '+57',
      flagUrl: 'https://flagcdn.com/w40/co.png',
    },
    {
      code: 'KM',
      name: 'Comoros',
      flag: '🇰🇲',
      dialCode: '+269',
      flagUrl: 'https://flagcdn.com/w40/km.png',
    },
    {
      code: 'CG',
      name: 'Congo',
      flag: '🇨🇬',
      dialCode: '+242',
      flagUrl: 'https://flagcdn.com/w40/cg.png',
    },
    {
      code: 'CR',
      name: 'Costa Rica',
      flag: '🇨🇷',
      dialCode: '+506',
      flagUrl: 'https://flagcdn.com/w40/cr.png',
    },
    {
      code: 'HR',
      name: 'Croatia',
      flag: '🇭🇷',
      dialCode: '+385',
      flagUrl: 'https://flagcdn.com/w40/hr.png',
    },
    {
      code: 'CU',
      name: 'Cuba',
      flag: '🇨🇺',
      dialCode: '+53',
      flagUrl: 'https://flagcdn.com/w40/cu.png',
    },
    {
      code: 'CY',
      name: 'Cyprus',
      flag: '🇨🇾',
      dialCode: '+357',
      flagUrl: 'https://flagcdn.com/w40/cy.png',
    },
    {
      code: 'CZ',
      name: 'Czech Republic',
      flag: '🇨🇿',
      dialCode: '+420',
      flagUrl: 'https://flagcdn.com/w40/cz.png',
    },

    {
      code: 'DK',
      name: 'Denmark',
      flag: '🇩🇰',
      dialCode: '+45',
      flagUrl: 'https://flagcdn.com/w40/dk.png',
    },
    {
      code: 'DJ',
      name: 'Djibouti',
      flag: '🇩🇯',
      dialCode: '+253',
      flagUrl: 'https://flagcdn.com/w40/dj.png',
    },
    {
      code: 'DM',
      name: 'Dominica',
      flag: '🇩🇲',
      dialCode: '+1-767',
      flagUrl: 'https://flagcdn.com/w40/dm.png',
    },
    {
      code: 'DO',
      name: 'Dominican Republic',
      flag: '🇩🇴',
      dialCode: '+1-809',
      flagUrl: 'https://flagcdn.com/w40/do.png',
    },

    {
      code: 'EC',
      name: 'Ecuador',
      flag: '🇪🇨',
      dialCode: '+593',
      flagUrl: 'https://flagcdn.com/w40/ec.png',
    },
    {
      code: 'EG',
      name: 'Egypt',
      flag: '🇪🇬',
      dialCode: '+20',
      flagUrl: 'https://flagcdn.com/w40/eg.png',
    },
    {
      code: 'SV',
      name: 'El Salvador',
      flag: '🇸🇻',
      dialCode: '+503',
      flagUrl: 'https://flagcdn.com/w40/sv.png',
    },
    {
      code: 'GQ',
      name: 'Equatorial Guinea',
      flag: '🇬🇶',
      dialCode: '+240',
      flagUrl: 'https://flagcdn.com/w40/gq.png',
    },
    {
      code: 'ER',
      name: 'Eritrea',
      flag: '🇪🇷',
      dialCode: '+291',
      flagUrl: 'https://flagcdn.com/w40/er.png',
    },
    {
      code: 'EE',
      name: 'Estonia',
      flag: '🇪🇪',
      dialCode: '+372',
      flagUrl: 'https://flagcdn.com/w40/ee.png',
    },
    {
      code: 'ET',
      name: 'Ethiopia',
      flag: '🇪🇹',
      dialCode: '+251',
      flagUrl: 'https://flagcdn.com/w40/et.png',
    },

    {
      code: 'FJ',
      name: 'Fiji',
      flag: '🇫🇯',
      dialCode: '+679',
      flagUrl: 'https://flagcdn.com/w40/fj.png',
    },
    {
      code: 'FI',
      name: 'Finland',
      flag: '🇫🇮',
      dialCode: '+358',
      flagUrl: 'https://flagcdn.com/w40/fi.png',
    },
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      dialCode: '+33',
      flagUrl: 'https://flagcdn.com/w40/fr.png',
    },

    {
      code: 'GA',
      name: 'Gabon',
      flag: '🇬🇦',
      dialCode: '+241',
      flagUrl: 'https://flagcdn.com/w40/ga.png',
    },
    {
      code: 'GM',
      name: 'Gambia',
      flag: '🇬🇲',
      dialCode: '+220',
      flagUrl: 'https://flagcdn.com/w40/gm.png',
    },
    {
      code: 'GE',
      name: 'Georgia',
      flag: '🇬🇪',
      dialCode: '+995',
      flagUrl: 'https://flagcdn.com/w40/ge.png',
    },
    {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      dialCode: '+49',
      flagUrl: 'https://flagcdn.com/w40/de.png',
    },
    {
      code: 'GH',
      name: 'Ghana',
      flag: '🇬🇭',
      dialCode: '+233',
      flagUrl: 'https://flagcdn.com/w40/gh.png',
    },
    {
      code: 'GR',
      name: 'Greece',
      flag: '🇬🇷',
      dialCode: '+30',
      flagUrl: 'https://flagcdn.com/w40/gr.png',
    },
    {
      code: 'GD',
      name: 'Grenada',
      flag: '🇬🇩',
      dialCode: '+1-473',
      flagUrl: 'https://flagcdn.com/w40/gd.png',
    },
    {
      code: 'GT',
      name: 'Guatemala',
      flag: '🇬🇹',
      dialCode: '+502',
      flagUrl: 'https://flagcdn.com/w40/gt.png',
    },
    {
      code: 'GN',
      name: 'Guinea',
      flag: '🇬🇳',
      dialCode: '+224',
      flagUrl: 'https://flagcdn.com/w40/gn.png',
    },
    {
      code: 'GW',
      name: 'Guinea-Bissau',
      flag: '🇬🇼',
      dialCode: '+245',
      flagUrl: 'https://flagcdn.com/w40/gw.png',
    },
    {
      code: 'GY',
      name: 'Guyana',
      flag: '🇬🇾',
      dialCode: '+592',
      flagUrl: 'https://flagcdn.com/w40/gy.png',
    },

    {
      code: 'HT',
      name: 'Haiti',
      flag: '🇭🇹',
      dialCode: '+509',
      flagUrl: 'https://flagcdn.com/w40/ht.png',
    },
    {
      code: 'HN',
      name: 'Honduras',
      flag: '🇭🇳',
      dialCode: '+504',
      flagUrl: 'https://flagcdn.com/w40/hn.png',
    },
    {
      code: 'HU',
      name: 'Hungary',
      flag: '🇭🇺',
      dialCode: '+36',
      flagUrl: 'https://flagcdn.com/w40/hu.png',
    },
    {
      code: 'IS',
      name: 'Iceland',
      flag: '🇮🇸',
      dialCode: '+354',
      flagUrl: 'https://flagcdn.com/w40/is.png',
    },
    {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      dialCode: '+91',
      flagUrl: 'https://flagcdn.com/w40/in.png',
    },
    {
      code: 'ID',
      name: 'Indonesia',
      flag: '🇮🇩',
      dialCode: '+62',
      flagUrl: 'https://flagcdn.com/w40/id.png',
    },
    {
      code: 'IR',
      name: 'Iran',
      flag: '🇮🇷',
      dialCode: '+98',
      flagUrl: 'https://flagcdn.com/w40/ir.png',
    },
    {
      code: 'IQ',
      name: 'Iraq',
      flag: '🇮🇶',
      dialCode: '+964',
      flagUrl: 'https://flagcdn.com/w40/iq.png',
    },
    {
      code: 'IE',
      name: 'Ireland',
      flag: '🇮🇪',
      dialCode: '+353',
      flagUrl: 'https://flagcdn.com/w40/ie.png',
    },
    {
      code: 'IL',
      name: 'Israel',
      flag: '🇮🇱',
      dialCode: '+972',
      flagUrl: 'https://flagcdn.com/w40/il.png',
    },
    {
      code: 'IT',
      name: 'Italy',
      flag: '🇮🇹',
      dialCode: '+39',
      flagUrl: 'https://flagcdn.com/w40/it.png',
    },

    {
      code: 'JM',
      name: 'Jamaica',
      flag: '🇯🇲',
      dialCode: '+1-876',
      flagUrl: 'https://flagcdn.com/w40/jm.png',
    },
    {
      code: 'JP',
      name: 'Japan',
      flag: '🇯🇵',
      dialCode: '+81',
      flagUrl: 'https://flagcdn.com/w40/jp.png',
    },
    {
      code: 'JO',
      name: 'Jordan',
      flag: '🇯🇴',
      dialCode: '+962',
      flagUrl: 'https://flagcdn.com/w40/jo.png',
    },

    {
      code: 'KZ',
      name: 'Kazakhstan',
      flag: '🇰🇿',
      dialCode: '+7',
      flagUrl: 'https://flagcdn.com/w40/kz.png',
    },
    {
      code: 'KE',
      name: 'Kenya',
      flag: '🇰🇪',
      dialCode: '+254',
      flagUrl: 'https://flagcdn.com/w40/ke.png',
    },
    {
      code: 'KI',
      name: 'Kiribati',
      flag: '🇰🇮',
      dialCode: '+686',
      flagUrl: 'https://flagcdn.com/w40/ki.png',
    },
    {
      code: 'KW',
      name: 'Kuwait',
      flag: '🇰🇼',
      dialCode: '+965',
      flagUrl: 'https://flagcdn.com/w40/kw.png',
    },
    {
      code: 'KG',
      name: 'Kyrgyzstan',
      flag: '🇰🇬',
      dialCode: '+996',
      flagUrl: 'https://flagcdn.com/w40/kg.png',
    },

    {
      code: 'LA',
      name: 'Laos',
      flag: '🇱🇦',
      dialCode: '+856',
      flagUrl: 'https://flagcdn.com/w40/la.png',
    },
    {
      code: 'LV',
      name: 'Latvia',
      flag: '🇱🇻',
      dialCode: '+371',
      flagUrl: 'https://flagcdn.com/w40/lv.png',
    },
    {
      code: 'LB',
      name: 'Lebanon',
      flag: '🇱🇧',
      dialCode: '+961',
      flagUrl: 'https://flagcdn.com/w40/lb.png',
    },
    {
      code: 'LS',
      name: 'Lesotho',
      flag: '🇱🇸',
      dialCode: '+266',
      flagUrl: 'https://flagcdn.com/w40/ls.png',
    },
    {
      code: 'LR',
      name: 'Liberia',
      flag: '🇱🇷',
      dialCode: '+231',
      flagUrl: 'https://flagcdn.com/w40/lr.png',
    },
    {
      code: 'LY',
      name: 'Libya',
      flag: '🇱🇾',
      dialCode: '+218',
      flagUrl: 'https://flagcdn.com/w40/ly.png',
    },
    {
      code: 'LI',
      name: 'Liechtenstein',
      flag: '🇱🇮',
      dialCode: '+423',
      flagUrl: 'https://flagcdn.com/w40/li.png',
    },
    {
      code: 'LT',
      name: 'Lithuania',
      flag: '🇱🇹',
      dialCode: '+370',
      flagUrl: 'https://flagcdn.com/w40/lt.png',
    },
    {
      code: 'LU',
      name: 'Luxembourg',
      flag: '🇱🇺',
      dialCode: '+352',
      flagUrl: 'https://flagcdn.com/w40/lu.png',
    },

    {
      code: 'MG',
      name: 'Madagascar',
      flag: '🇲🇬',
      dialCode: '+261',
      flagUrl: 'https://flagcdn.com/w40/mg.png',
    },
    {
      code: 'MW',
      name: 'Malawi',
      flag: '🇲🇼',
      dialCode: '+265',
      flagUrl: 'https://flagcdn.com/w40/mw.png',
    },
    {
      code: 'MY',
      name: 'Malaysia',
      flag: '🇲🇾',
      dialCode: '+60',
      flagUrl: 'https://flagcdn.com/w40/my.png',
    },
    {
      code: 'MV',
      name: 'Maldives',
      flag: '🇲🇻',
      dialCode: '+960',
      flagUrl: 'https://flagcdn.com/w40/mv.png',
    },
    {
      code: 'ML',
      name: 'Mali',
      flag: '🇲🇱',
      dialCode: '+223',
      flagUrl: 'https://flagcdn.com/w40/ml.png',
    },
    {
      code: 'MT',
      name: 'Malta',
      flag: '🇲🇹',
      dialCode: '+356',
      flagUrl: 'https://flagcdn.com/w40/mt.png',
    },
    {
      code: 'MH',
      name: 'Marshall Islands',
      flag: '🇲🇭',
      dialCode: '+692',
      flagUrl: 'https://flagcdn.com/w40/mh.png',
    },
    {
      code: 'MR',
      name: 'Mauritania',
      flag: '🇲🇷',
      dialCode: '+222',
      flagUrl: 'https://flagcdn.com/w40/mr.png',
    },
    {
      code: 'MU',
      name: 'Mauritius',
      flag: '🇲🇺',
      dialCode: '+230',
      flagUrl: 'https://flagcdn.com/w40/mu.png',
    },
    {
      code: 'MX',
      name: 'Mexico',
      flag: '🇲🇽',
      dialCode: '+52',
      flagUrl: 'https://flagcdn.com/w40/mx.png',
    },
    {
      code: 'FM',
      name: 'Micronesia',
      flag: '🇫🇲',
      dialCode: '+691',
      flagUrl: 'https://flagcdn.com/w40/fm.png',
    },
    {
      code: 'MD',
      name: 'Moldova',
      flag: '🇲🇩',
      dialCode: '+373',
      flagUrl: 'https://flagcdn.com/w40/md.png',
    },
    {
      code: 'MC',
      name: 'Monaco',
      flag: '🇲🇨',
      dialCode: '+377',
      flagUrl: 'https://flagcdn.com/w40/mc.png',
    },
    {
      code: 'MN',
      name: 'Mongolia',
      flag: '🇲🇳',
      dialCode: '+976',
      flagUrl: 'https://flagcdn.com/w40/mn.png',
    },
    {
      code: 'ME',
      name: 'Montenegro',
      flag: '🇲🇪',
      dialCode: '+382',
      flagUrl: 'https://flagcdn.com/w40/me.png',
    },
    {
      code: 'MA',
      name: 'Morocco',
      flag: '🇲🇦',
      dialCode: '+212',
      flagUrl: 'https://flagcdn.com/w40/ma.png',
    },
    {
      code: 'MZ',
      name: 'Mozambique',
      flag: '🇲🇿',
      dialCode: '+258',
      flagUrl: 'https://flagcdn.com/w40/mz.png',
    },
    {
      code: 'MM',
      name: 'Myanmar',
      flag: '🇲🇲',
      dialCode: '+95',
      flagUrl: 'https://flagcdn.com/w40/mm.png',
    },

    {
      code: 'NA',
      name: 'Namibia',
      flag: '🇳🇦',
      dialCode: '+264',
      flagUrl: 'https://flagcdn.com/w40/na.png',
    },
    {
      code: 'NR',
      name: 'Nauru',
      flag: '🇳🇷',
      dialCode: '+674',
      flagUrl: 'https://flagcdn.com/w40/nr.png',
    },
    {
      code: 'NP',
      name: 'Nepal',
      flag: '🇳🇵',
      dialCode: '+977',
      flagUrl: 'https://flagcdn.com/w40/np.png',
    },
    {
      code: 'NL',
      name: 'Netherlands',
      flag: '🇳🇱',
      dialCode: '+31',
      flagUrl: 'https://flagcdn.com/w40/nl.png',
    },
    {
      code: 'NZ',
      name: 'New Zealand',
      flag: '🇳🇿',
      dialCode: '+64',
      flagUrl: 'https://flagcdn.com/w40/nz.png',
    },
    {
      code: 'NI',
      name: 'Nicaragua',
      flag: '🇳🇮',
      dialCode: '+505',
      flagUrl: 'https://flagcdn.com/w40/ni.png',
    },
    {
      code: 'NE',
      name: 'Niger',
      flag: '🇳🇪',
      dialCode: '+227',
      flagUrl: 'https://flagcdn.com/w40/ne.png',
    },
    {
      code: 'NG',
      name: 'Nigeria',
      flag: '🇳🇬',
      dialCode: '+234',
      flagUrl: 'https://flagcdn.com/w40/ng.png',
    },
    {
      code: 'KP',
      name: 'North Korea',
      flag: '🇰🇵',
      dialCode: '+850',
      flagUrl: 'https://flagcdn.com/w40/kp.png',
    },
    {
      code: 'MK',
      name: 'North Macedonia',
      flag: '🇲🇰',
      dialCode: '+389',
      flagUrl: 'https://flagcdn.com/w40/mk.png',
    },
    {
      code: 'NO',
      name: 'Norway',
      flag: '🇳🇴',
      dialCode: '+47',
      flagUrl: 'https://flagcdn.com/w40/no.png',
    },

    {
      code: 'OM',
      name: 'Oman',
      flag: '🇴🇲',
      dialCode: '+968',
      flagUrl: 'https://flagcdn.com/w40/om.png',
    },

    {
      code: 'PK',
      name: 'Pakistan',
      flag: '🇵🇰',
      dialCode: '+92',
      flagUrl: 'https://flagcdn.com/w40/pk.png',
    },
    {
      code: 'PW',
      name: 'Palau',
      flag: '🇵🇼',
      dialCode: '+680',
      flagUrl: 'https://flagcdn.com/w40/pw.png',
    },
    {
      code: 'PA',
      name: 'Panama',
      flag: '🇵🇦',
      dialCode: '+507',
      flagUrl: 'https://flagcdn.com/w40/pa.png',
    },
    {
      code: 'PG',
      name: 'Papua New Guinea',
      flag: '🇵🇬',
      dialCode: '+675',
      flagUrl: 'https://flagcdn.com/w40/pg.png',
    },
    {
      code: 'PY',
      name: 'Paraguay',
      flag: '🇵🇾',
      dialCode: '+595',
      flagUrl: 'https://flagcdn.com/w40/py.png',
    },
    {
      code: 'PE',
      name: 'Peru',
      flag: '🇵🇪',
      dialCode: '+51',
      flagUrl: 'https://flagcdn.com/w40/pe.png',
    },
    {
      code: 'PH',
      name: 'Philippines',
      flag: '🇵🇭',
      dialCode: '+63',
      flagUrl: 'https://flagcdn.com/w40/ph.png',
    },
    {
      code: 'PL',
      name: 'Poland',
      flag: '🇵🇱',
      dialCode: '+48',
      flagUrl: 'https://flagcdn.com/w40/pl.png',
    },
    {
      code: 'PT',
      name: 'Portugal',
      flag: '🇵🇹',
      dialCode: '+351',
      flagUrl: 'https://flagcdn.com/w40/pt.png',
    },

    {
      code: 'QA',
      name: 'Qatar',
      flag: '🇶🇦',
      dialCode: '+974',
      flagUrl: 'https://flagcdn.com/w40/qa.png',
    },

    {
      code: 'RO',
      name: 'Romania',
      flag: '🇷🇴',
      dialCode: '+40',
      flagUrl: 'https://flagcdn.com/w40/ro.png',
    },
    {
      code: 'RU',
      name: 'Russia',
      flag: '🇷🇺',
      dialCode: '+7',
      flagUrl: 'https://flagcdn.com/w40/ru.png',
    },
    {
      code: 'RW',
      name: 'Rwanda',
      flag: '🇷🇼',
      dialCode: '+250',
      flagUrl: 'https://flagcdn.com/w40/rw.png',
    },
    {
      code: 'KN',
      name: 'Saint Kitts and Nevis',
      flag: '🇰🇳',
      dialCode: '+1-869',
      flagUrl: 'https://flagcdn.com/w40/kn.png',
    },
    {
      code: 'LC',
      name: 'Saint Lucia',
      flag: '🇱🇨',
      dialCode: '+1-758',
      flagUrl: 'https://flagcdn.com/w40/lc.png',
    },
    {
      code: 'VC',
      name: 'Saint Vincent and the Grenadines',
      flag: '🇻🇨',
      dialCode: '+1-784',
      flagUrl: 'https://flagcdn.com/w40/vc.png',
    },

    {
      code: 'WS',
      name: 'Samoa',
      flag: '🇼🇸',
      dialCode: '+685',
      flagUrl: 'https://flagcdn.com/w40/ws.png',
    },
    {
      code: 'SM',
      name: 'San Marino',
      flag: '🇸🇲',
      dialCode: '+378',
      flagUrl: 'https://flagcdn.com/w40/sm.png',
    },
    {
      code: 'ST',
      name: 'Sao Tome and Principe',
      flag: '🇸🇹',
      dialCode: '+239',
      flagUrl: 'https://flagcdn.com/w40/st.png',
    },

    {
      code: 'SA',
      name: 'Saudi Arabia',
      flag: '🇸🇦',
      dialCode: '+966',
      flagUrl: 'https://flagcdn.com/w40/sa.png',
    },
    {
      code: 'SN',
      name: 'Senegal',
      flag: '🇸🇳',
      dialCode: '+221',
      flagUrl: 'https://flagcdn.com/w40/sn.png',
    },
    {
      code: 'RS',
      name: 'Serbia',
      flag: '🇷🇸',
      dialCode: '+381',
      flagUrl: 'https://flagcdn.com/w40/rs.png',
    },
    {
      code: 'SC',
      name: 'Seychelles',
      flag: '🇸🇨',
      dialCode: '+248',
      flagUrl: 'https://flagcdn.com/w40/sc.png',
    },
    {
      code: 'SL',
      name: 'Sierra Leone',
      flag: '🇸🇱',
      dialCode: '+232',
      flagUrl: 'https://flagcdn.com/w40/sl.png',
    },
    {
      code: 'SG',
      name: 'Singapore',
      flag: '🇸🇬',
      dialCode: '+65',
      flagUrl: 'https://flagcdn.com/w40/sg.png',
    },
    {
      code: 'SK',
      name: 'Slovakia',
      flag: '🇸🇰',
      dialCode: '+421',
      flagUrl: 'https://flagcdn.com/w40/sk.png',
    },
    {
      code: 'SI',
      name: 'Slovenia',
      flag: '🇸🇮',
      dialCode: '+386',
      flagUrl: 'https://flagcdn.com/w40/si.png',
    },
    {
      code: 'SB',
      name: 'Solomon Islands',
      flag: '🇸🇧',
      dialCode: '+677',
      flagUrl: 'https://flagcdn.com/w40/sb.png',
    },
    {
      code: 'SO',
      name: 'Somalia',
      flag: '🇸🇴',
      dialCode: '+252',
      flagUrl: 'https://flagcdn.com/w40/so.png',
    },

    {
      code: 'ZA',
      name: 'South Africa',
      flag: '🇿🇦',
      dialCode: '+27',
      flagUrl: 'https://flagcdn.com/w40/za.png',
    },
    {
      code: 'KR',
      name: 'South Korea',
      flag: '🇰🇷',
      dialCode: '+82',
      flagUrl: 'https://flagcdn.com/w40/kr.png',
    },
    {
      code: 'SS',
      name: 'South Sudan',
      flag: '🇸🇸',
      dialCode: '+211',
      flagUrl: 'https://flagcdn.com/w40/ss.png',
    },

    {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      dialCode: '+34',
      flagUrl: 'https://flagcdn.com/w40/es.png',
    },
    {
      code: 'LK',
      name: 'Sri Lanka',
      flag: '🇱🇰',
      dialCode: '+94',
      flagUrl: 'https://flagcdn.com/w40/lk.png',
    },
    {
      code: 'SD',
      name: 'Sudan',
      flag: '🇸🇩',
      dialCode: '+249',
      flagUrl: 'https://flagcdn.com/w40/sd.png',
    },
    {
      code: 'SR',
      name: 'Suriname',
      flag: '🇸🇷',
      dialCode: '+597',
      flagUrl: 'https://flagcdn.com/w40/sr.png',
    },

    {
      code: 'SE',
      name: 'Sweden',
      flag: '🇸🇪',
      dialCode: '+46',
      flagUrl: 'https://flagcdn.com/w40/se.png',
    },
    {
      code: 'CH',
      name: 'Switzerland',
      flag: '🇨🇭',
      dialCode: '+41',
      flagUrl: 'https://flagcdn.com/w40/ch.png',
    },
    {
      code: 'SY',
      name: 'Syria',
      flag: '🇸🇾',
      dialCode: '+963',
      flagUrl: 'https://flagcdn.com/w40/sy.png',
    },

    {
      code: 'TW',
      name: 'Taiwan',
      flag: '🇹🇼',
      dialCode: '+886',
      flagUrl: 'https://flagcdn.com/w40/tw.png',
    },
    {
      code: 'TJ',
      name: 'Tajikistan',
      flag: '🇹🇯',
      dialCode: '+992',
      flagUrl: 'https://flagcdn.com/w40/tj.png',
    },
    {
      code: 'TZ',
      name: 'Tanzania',
      flag: '🇹🇿',
      dialCode: '+255',
      flagUrl: 'https://flagcdn.com/w40/tz.png',
    },
    {
      code: 'TH',
      name: 'Thailand',
      flag: '🇹🇭',
      dialCode: '+66',
      flagUrl: 'https://flagcdn.com/w40/th.png',
    },
    {
      code: 'TL',
      name: 'Timor-Leste',
      flag: '🇹🇱',
      dialCode: '+670',
      flagUrl: 'https://flagcdn.com/w40/tl.png',
    },
    {
      code: 'TG',
      name: 'Togo',
      flag: '🇹🇬',
      dialCode: '+228',
      flagUrl: 'https://flagcdn.com/w40/tg.png',
    },
    {
      code: 'TO',
      name: 'Tonga',
      flag: '🇹🇴',
      dialCode: '+676',
      flagUrl: 'https://flagcdn.com/w40/to.png',
    },
    {
      code: 'TT',
      name: 'Trinidad and Tobago',
      flag: '🇹🇹',
      dialCode: '+1-868',
      flagUrl: 'https://flagcdn.com/w40/tt.png',
    },
    {
      code: 'TN',
      name: 'Tunisia',
      flag: '🇹🇳',
      dialCode: '+216',
      flagUrl: 'https://flagcdn.com/w40/tn.png',
    },
    {
      code: 'TR',
      name: 'Turkey',
      flag: '🇹🇷',
      dialCode: '+90',
      flagUrl: 'https://flagcdn.com/w40/tr.png',
    },
    {
      code: 'TM',
      name: 'Turkmenistan',
      flag: '🇹🇲',
      dialCode: '+993',
      flagUrl: 'https://flagcdn.com/w40/tm.png',
    },
    {
      code: 'TV',
      name: 'Tuvalu',
      flag: '🇹🇻',
      dialCode: '+688',
      flagUrl: 'https://flagcdn.com/w40/tv.png',
    },

    {
      code: 'UG',
      name: 'Uganda',
      flag: '🇺🇬',
      dialCode: '+256',
      flagUrl: 'https://flagcdn.com/w40/ug.png',
    },
    {
      code: 'UA',
      name: 'Ukraine',
      flag: '🇺🇦',
      dialCode: '+380',
      flagUrl: 'https://flagcdn.com/w40/ua.png',
    },

    // 🇦🇪 UAE — Correct Position
    {
      code: 'AE',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      dialCode: '+971',
      flagUrl: 'https://flagcdn.com/w40/ae.png',
    },

    {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      dialCode: '+44',
      flagUrl: 'https://flagcdn.com/w40/gb.png',
    },
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      dialCode: '+1',
      flagUrl: 'https://flagcdn.com/w40/us.png',
    },
    {
      code: 'UY',
      name: 'Uruguay',
      flag: '🇺🇾',
      dialCode: '+598',
      flagUrl: 'https://flagcdn.com/w40/uy.png',
    },
    {
      code: 'UZ',
      name: 'Uzbekistan',
      flag: '🇺🇿',
      dialCode: '+998',
      flagUrl: 'https://flagcdn.com/w40/uz.png',
    },

    {
      code: 'VU',
      name: 'Vanuatu',
      flag: '🇻🇺',
      dialCode: '+678',
      flagUrl: 'https://flagcdn.com/w40/vu.png',
    },
    {
      code: 'VA',
      name: 'Vatican City',
      flag: '🇻🇦',
      dialCode: '+39',
      flagUrl: 'https://flagcdn.com/w40/va.png',
    },
    {
      code: 'VE',
      name: 'Venezuela',
      flag: '🇻🇪',
      dialCode: '+58',
      flagUrl: 'https://flagcdn.com/w40/ve.png',
    },
    {
      code: 'VN',
      name: 'Vietnam',
      flag: '🇻🇳',
      dialCode: '+84',
      flagUrl: 'https://flagcdn.com/w40/vn.png',
    },

    {
      code: 'YE',
      name: 'Yemen',
      flag: '🇾🇪',
      dialCode: '+967',
      flagUrl: 'https://flagcdn.com/w40/ye.png',
    },

    {
      code: 'ZM',
      name: 'Zambia',
      flag: '🇿🇲',
      dialCode: '+260',
      flagUrl: 'https://flagcdn.com/w40/zm.png',
    },
    {
      code: 'ZW',
      name: 'Zimbabwe',
      flag: '🇿🇼',
      dialCode: '+263',
      flagUrl: 'https://flagcdn.com/w40/zw.png',
    },
  ];

  filteredCountries: Country[] = [...this.countries];
  selectedCountry: Country | null = null;
  isOpen = false;
  isFocused = false;
  searchTerm = '';
  showError = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  get isFloating(): boolean {
    return !!this.selectedCountry;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.isFocused = this.isOpen;
    if (this.isOpen) {
      this.searchTerm = '';
      this.filteredCountries = [...this.countries];
    }
    this.onTouched();
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.isOpen = false;
    this.isFocused = false;
    this.showError = false;
    this.onChange(country.code);
    this.contactForm.patchValue({ country: this.selectedCountry.name });
    this.contactForm.patchValue({ countryCode: this.selectedCountry.dialCode });
    console.log(this.contactForm.getRawValue());
  }

  filterCountries() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCountries = this.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(term) ||
        country.code.toLowerCase().includes(term) ||
        country.dialCode.includes(term),
    );
  }

  writeValue(value: string): void {
    if (value) {
      this.selectedCountry = this.countries.find((c) => c.code === value) || null;
    } else {
      this.selectedCountry = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }

  validate() {
    this.showError = !this.selectedCountry;
    return !this.showError;
  }
}
