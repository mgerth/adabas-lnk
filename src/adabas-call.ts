/*
 * Copyright © 2019-2020 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

import * as ffi from 'ffi';
import * as os from 'os';
import * as ref from 'ref';
import * as ArrayType from 'ref-array';

import { PayloadData } from './interfaces';
import { hexdump } from './common';
export class AdabasCall {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adalnkx: any;
    private log: string[];

    constructor(log: string[] = []) {
        this.log = log;

        const libName = (os.platform() == 'win32') ? 'adalnkx' : 'libadalnkx.so';
        const abd = ref.types.void;
        const abdPtr = ref.refType(abd);
        const abdArray = ArrayType(abdPtr);
        // binding to a few "adalnkx" functions...
        this.adalnkx = ffi.Library(libName, {
            'adabasx': ['int', ['pointer', 'int', abdArray]]
        });
    }

    call(payload: PayloadData): Promise<PayloadData> {
        return new Promise(async (resolve, reject) => {
            try {
                const abda = payload.abda ? payload.abda.getAbdArray(): [];
                if (this.log) {
                    if (this.log.includes('cb')) {
                        console.log(payload.cb.toString());
                        console.log(hexdump(payload.cb.getBuffer(), 'Before Control Block'));
                    }
                    if (this.log.includes('before') && payload.abda) {
                        payload.abda.dump('Before Buffer');
                    }
                }
                this.adalnkx.adabasx(payload.cb.acbx, abda.length, abda);
                if (this.log) {
                    if (this.log.includes('cb')) {
                        console.log(payload.cb.toString());
                        console.log(hexdump(payload.cb.getBuffer(), 'After Control Block'));
                      }
                    if (this.log.includes('after') && payload.abda) {
                        payload.abda.dump('After Buffer');
                    }
                }
                resolve(payload);
            } catch (error) {
                reject(error);
            }
        });
    }

}
