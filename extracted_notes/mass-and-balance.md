# MASS AND BALANCE

## 1. Purpose and Importance

### Importance with regard to structural limitations
- **Structural Integrity**: Operating within mass limits ensures the aircraft structure (wings, fuselage, landing gear) can withstand flight loads (turbulence, maneuvers) and ground loads (landing impact).
- **Overloading**: Can cause permanent deformation or structural failure.
- **CG Limits**: Exceeding CG limits can impose excessive loads on the tailplane or nosegear.

### Importance with regard to performance Remark: See also Subjects 032/034 and 081/082.
- **Mass Effects**:
  - Higher Mass = Higher Stalling Speed ($V_S$), Higher Take-off Speed ($V_{R}, V_{2}$), Longer Take-off Run, Lower Climb Gradient, Lower Ceiling, Higher Fuel Consumption, Higher Wear on Brakes/Tyres.
- **CG Effects**: (Also relevant to 031 01 02 02)
  - **Forward CG**: Higher Stall Speed, Higher Drag (Trim Drag), Lower Cruise Speed, Higher Fuel Consumption.
  - **Aft CG**: Lower Stall Speed, Lower Drag, Higher Cruise Speed, Lower Fuel Consumption.

### Importance with regard to stability and controllability
- **Forward Limit**: Determined by **Control Authority** (Elevator effectiveness).
  - Too far forward: Elevator may not be able to raise the nose for flare/landing or takeoff rotation.
- **Aft Limit**: Determined by **Longitudinal Stability**.
  - Too far aft: Aircraft becomes unstable (Neutral Point approach). Stick forces become light, risk of stall/spin recovery issues.

## 2. Terminology, Definitions and Limitations

### Mass terms
| Term | Definition |
|---|---|
| **Basic Empty Mass (BEM)** | Mass of the aircraft + Unusable Fuel + Unusable Fluids + Oil + Standard Equip. |
| **Dry Operating Mass (DOM)** | BEM + Crew + Pantry. (Mass ready to fly but NO FUEL, NO TRAFFIC LOAD). |
| **Operating Mass (OM)** | DOM + Take-off Fuel. |
| **Zero Fuel Mass (ZFM)** | DOM + Traffic Load. |
| **Taxi Mass** | Mass at ramp. |
| **Take-off Mass (TOM)** | Mass at brake release. |
| **Landing Mass (LM)** | Mass at touch down. |

### Load terms (including fuel terms) Remark: See also Subject 033.
| Term | Definition |
|---|---|
| **Traffic Load** | Total mass of Passengers + Baggage + Cargo. |
| **Useful Load** | Traffic Load + Usable Fuel. |
| **BLOCK FUEL** | Taxi Fuel + Trip Fuel + Contingency + Alternate + Final Reserve + Extra. |

### Structural limitations
- **MSTOM**: Maximum Structural Take-off Mass.
- **MSLM**: Maximum Structural Landing Mass.
- **MZFM**: Maximum Zero Fuel Mass. (Prevents wing bending relief limits).

### Performance and regulated limitations
- **PLTOM**: Performance Limited Take-off Mass (Runway, Obstacles, Climb).
- **PLLM**: Performance Limited Landing Mass (Runway, Climb).
- **Regulated Limit**: The lowest of Structural or Performance limit.

### Cargo compartment limitations
- **Max Load**: Total weight limit for the hold.
- **Floor Load**: $kg/m^2$ limit.
- **Running Load**: $kg/m$ limit.

### Maximum masses for take-off and landing
- Defined by the lowest of Structural, Performance, or noise/tire speed limits.

### Allowed traffic load and fuel load
- **Allowed Traffic Load** = Allowed TOM - DOM - Fuel. (Or limited by ZFM).
- **Allowed Fuel** = Allowed TOM - ZFM. (Or limited by Tank Capacity).

### Use of standard masses for passengers, baggage and crew
- **Standard Masses** (EU-OPS): 
  - Adult (All): 84 kg
  - Male: 88 kg | Female: 70 kg
  - Child: 35 kg
  - Hand baggage included.

## 3. Centre of Gravity (CG)

### Datum, moment arm
- **Datum**: Reference plane for all measurements.
- **Arm**: Distance from Datum to CG of an item.
- **Moment**: $Mass \times Arm$.

### CG position as distance from datum
- $CG = \frac{\Sigma Moments}{\Sigma Mass}$. Expressed in distance units (m, in).

### CG position as percentage of mean aerodynamic chord (% MAC)
- Formula: $CG_{\%MAC} = \frac{CG_{dist} - LEMAC}{MAC} \times 100$

### Longitudinal CG limits
- Specified in AFM. Must be respected for safe flight (Stability vs Control).

### Lateral CG limits
- Relevance: Helicopters, asymmetric fuel/cargo.

### Details of passenger and cargo compartments
- Zones (Oa, Ob, Oc...). Centroids provided for calculation.
- Cargo holds: Fwd, Aft, Bulk.

### Details of fuel system relevant to mass-and-balance considerations
- Fuel burn sequence affects CG.
- Moment of fuel changes with quantity (Fuel Index).

## 4. Weighing and Procedures

### Weighing of aircraft (general aspects)
- Requirements: Clean, dry, enclosed hangar, equipment list check. Frequency: 4yrs / 9yrs.

### Calculation of mass and CG position of an aircraft using weighing data
- Weigh reactions at wheels/jacks. 
- Sum moments relative to Datum.

### BEM or dry operating mass (DOM)
- **BEM**: Result of weighing.
- **DOM**: Calculated (BEM + Crew + Pantry).

### CG position or moment at BEM/DOM
- Must be established to start flight calculations.

### Deviations from standard configuration
- Cumulative changes > 0.5% mass or CG tolerance -> Re-weigh or recalculate.

## 5. Calculation Methods

### Arithmetic method
- Sum Mass, Sum Moments, Divide.

### Graphic method
- CG Envelope. Vectors for loading.

### Index method
- Use of Index Units ($Moment / C$).

### General considerations
- Accuracy, verifying inputs.

### Load sheet/balance schedule and CG envelope for light aeroplanes and for helicopters
- Simplified plots. Pilot responsibility.

### Load sheet for large aeroplanes
- Complex, multiple fuel tanks, pax zones.

### Trim sheet for large aeroplanes
- Calculates Stabilizer Trim Setting (Green Band).

### Other methods to present load and trim information
- EFB (Electronic Flight Bag), On-board Weight and Balance Systems (OBWBS).

### Repositioning of CG by shifting the load
- $Mass_{shifted} = \frac{\Delta CG \times Total Mass}{Distance_{moved}}$

### Repositioning of CG by additional load or ballast or by load or ballast removal
- New Moment calculation.

## 6. Cargo

### Types of cargo (general aspects)
- Bulk, Containerized (ULD), Special (Live animals, Dangerous Goods).

### Floor-area load and running-load limitations in cargo compartments
- Area Load: $\frac{Force}{Area}$. Running Load: $\frac{Force}{Length}$.
- Use spreaders (shoring) to reduce intensity.

### Securement of load (reasons and methods)
- **Constraint**: Prevent movement.
- **Forward restraint load factors**: 9g (typ) for emergency landing protection.
- Nets, straps, locks.

